from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.weather import Location, WeatherForecast, WeatherAlert
from app.schemas.weather import WeatherForecastCreate
from app.repositories.weather import WeatherRepository
from app.core.cache import cache

class WeatherService:
    """Service xử lý nghiệp vụ Thời tiết (Forecast, Location, Alert)"""
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = WeatherRepository(db)

    async def get_locations(self) -> List[Location]:
        """Lấy danh sách vị trí có áp dụng Cache"""
        cache_key = "weather_locations"
        cached_locations = cache.get(cache_key)
        if cached_locations:
            return cached_locations
            
        locations = await self.repo.get_locations()
        cache.set(cache_key, locations, ttl_seconds=86400) # Cache 1 ngày
        return locations

    async def get_forecast(self, location_code: str) -> List[WeatherForecast]:
        """Lấy dự báo thời tiết có áp dụng Cache"""
        cache_key = f"weather_forecast_{location_code}"
        cached_forecast = cache.get(cache_key)
        if cached_forecast:
            return cached_forecast

        location = await self.repo.get_location_by_code(location_code)
        if not location:
            raise HTTPException(status_code=404, detail="Không tìm thấy vị trí")
            
        forecasts = await self.repo.get_forecasts(location.id)
        cache.set(cache_key, forecasts, ttl_seconds=3600) # Cache 1 giờ
        return forecasts

    async def get_alerts(self, location_code: str) -> List[WeatherAlert]:
        """Lấy cảnh báo thời tiết có áp dụng Cache"""
        cache_key = f"weather_alerts_{location_code}"
        cached_alerts = cache.get(cache_key)
        if cached_alerts:
            return cached_alerts

        location = await self.repo.get_location_by_code(location_code)
        if not location:
            raise HTTPException(status_code=404, detail="Không tìm thấy vị trí")
            
        alerts = await self.repo.get_active_alerts(location.id)
        cache.set(cache_key, alerts, ttl_seconds=300) # Cache 5 phút cho cảnh báo
        return alerts

    async def fetch_weather_data_background(self) -> None:
        """
        Hàm chạy ngầm để đồng bộ dữ liệu thời tiết
        Sẽ được gọi bởi Scheduler định kỳ
        """
        from collections import defaultdict
        from datetime import datetime, timezone, timedelta
        from sqlalchemy import delete
        from app.services.weather_client import weather_client
        from app.core.logger import logger

        locations = await self.repo.get_locations()
        tz_vn = timezone(timedelta(hours=7))

        for location in locations:
            if not location.latitude or not location.longitude:
                logger.warning(f"Vị trí {location.name} thiếu tọa độ, bỏ qua đồng bộ thời tiết.")
                continue

            logger.info(f"Đang đồng bộ thời tiết cho vị trí: {location.name}")
            forecast_data = await weather_client.get_forecast_by_coords(location.latitude, location.longitude)
            if not forecast_data or "list" not in forecast_data:
                logger.error(f"Không thể lấy dữ liệu thời tiết cho vị trí: {location.name}")
                continue

            # Nhóm các mốc dự báo 3 giờ theo ngày dương lịch Việt Nam (UTC+7)
            daily_slots = defaultdict(list)
            for item in forecast_data["list"]:
                dt = item["dt"]
                local_dt = datetime.fromtimestamp(dt, tz=tz_vn)
                local_date = local_dt.date()
                daily_slots[local_date].append((local_dt, item))

            try:
                # Xóa dự báo cũ của vị trí này trước khi thêm mới
                await self.db.execute(
                    delete(WeatherForecast).where(WeatherForecast.location_id == location.id)
                )

                for day_date, slots in daily_slots.items():
                    # Tổng hợp các thông số trong ngày
                    temps_min = [s[1]["main"]["temp_min"] for s in slots]
                    temps_max = [s[1]["main"]["temp_max"] for s in slots]
                    humidities = [s[1]["main"]["humidity"] for s in slots]
                    wind_speeds = [s[1]["wind"]["speed"] for s in slots]
                    precipitations = [
                        s[1].get("rain", {}).get("3h", 0.0) + s[1].get("snow", {}).get("3h", 0.0)
                        for s in slots
                    ]

                    temp_min = min(temps_min)
                    temp_max = max(temps_max)
                    avg_humidity = sum(humidities) / len(humidities)
                    avg_wind_speed = sum(wind_speeds) / len(wind_speeds)
                    total_precipitation = sum(precipitations)

                    # Tìm mốc thời gian gần 12:00 trưa nhất để lấy mô tả thời tiết chính
                    best_slot = min(slots, key=lambda s: abs(s[0].hour - 12))
                    best_item = best_slot[1]

                    condition = "Quang đãng"
                    icon_code = None
                    if "weather" in best_item and len(best_item["weather"]) > 0:
                        condition = best_item["weather"][0].get("description", "Quang đãng").capitalize()
                        icon_code = best_item["weather"][0].get("icon")

                    icon_url = f"https://openweathermap.org/img/wn/{icon_code}@2x.png" if icon_code else None

                    # Định ngày dự báo tại múi giờ UTC+7
                    forecast_datetime = datetime(
                        day_date.year, day_date.month, day_date.day,
                        tzinfo=tz_vn
                    )

                    new_forecast = WeatherForecast(
                        location_id=location.id,
                        forecast_date=forecast_datetime,
                        temperature_min=temp_min,
                        temperature_max=temp_max,
                        humidity=avg_humidity,
                        precipitation=total_precipitation,
                        wind_speed=avg_wind_speed,
                        condition=condition,
                        icon_url=icon_url
                    )
                    self.db.add(new_forecast)

                await self.db.commit()
                
                # Xóa cache dự báo thời tiết cho vị trí này
                cache_key = f"weather_forecast_{location.code}"
                cache.delete(cache_key)
                
                logger.info(f"Đã đồng bộ thành công thời tiết cho vị trí: {location.name}")
            except Exception as e:
                await self.db.rollback()
                logger.error(f"Lỗi khi lưu dữ liệu thời tiết cho {location.name}: {e}")
