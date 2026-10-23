from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime
from app.models.weather import Location, WeatherForecast, WeatherAlert

class WeatherRepository:
    """Repository quản lý truy xuất dữ liệu Thời tiết"""
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Location ---
    async def get_locations(self) -> List[Location]:
        """Lấy danh sách vị trí đang hoạt động"""
        query = select(Location).where(Location.is_active == True)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_location_by_code(self, code: str) -> Optional[Location]:
        """Lấy vị trí theo mã"""
        query = select(Location).where(Location.code == code)
        result = await self.db.execute(query)
        return result.scalars().first()

    # --- Forecast ---
    async def get_forecast(self, location_id: int, date: datetime) -> Optional[WeatherForecast]:
        """Lấy dự báo thời tiết theo ngày cụ thể"""
        query = select(WeatherForecast).where(
            and_(
                WeatherForecast.location_id == location_id,
                WeatherForecast.forecast_date >= date
            )
        ).order_by(WeatherForecast.forecast_date)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_forecasts(self, location_id: int) -> List[WeatherForecast]:
        """Lấy tất cả dự báo của một vị trí"""
        query = select(WeatherForecast).where(WeatherForecast.location_id == location_id).order_by(WeatherForecast.forecast_date)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def save_forecast(self, forecast: WeatherForecast) -> WeatherForecast:
        """Lưu dự báo thời tiết"""
        self.db.add(forecast)
        await self.db.commit()
        await self.db.refresh(forecast)
        return forecast

    # --- Alert ---
    async def get_active_alerts(self, location_id: int) -> List[WeatherAlert]:
        """Lấy các cảnh báo thời tiết đang có hiệu lực"""
        from datetime import timezone
        now = datetime.now(timezone.utc)
        query = select(WeatherAlert).where(
            and_(
                WeatherAlert.location_id == location_id,
                WeatherAlert.is_active == True,
                WeatherAlert.end_time >= now
            )
        )
        result = await self.db.execute(query)
        return result.scalars().all()
