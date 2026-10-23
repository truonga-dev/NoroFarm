import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_get_locations(client: AsyncClient):
    response = await client.get("/api/v1/weather/locations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


async def test_weather_sync():
    from unittest.mock import AsyncMock, patch
    from sqlalchemy import select
    from app.models.weather import Location, WeatherForecast
    from app.services.weather import WeatherService
    from app.database.session import AsyncSessionLocal

    # Dữ liệu dự báo giả lập
    mock_forecast = {
        "list": [
            {
                "dt": 1783664290, # Mốc thời gian mẫu
                "main": {
                    "temp_min": 20.0,
                    "temp_max": 25.0,
                    "humidity": 80,
                },
                "weather": [
                    {"description": "mưa nhẹ", "icon": "10d"}
                ],
                "wind": {"speed": 3.5},
                "rain": {"3h": 1.2}
            },
            {
                "dt": 1783664290 + 3600 * 3, # 3 giờ sau
                "main": {
                    "temp_min": 21.0,
                    "temp_max": 26.0,
                    "humidity": 75,
                },
                "weather": [
                    {"description": "mưa vừa", "icon": "10d"}
                ],
                "wind": {"speed": 4.0},
                "rain": {"3h": 0.8}
            }
        ]
    }

    # Patch weather_client
    with patch("app.services.weather.weather_client.get_forecast_by_coords", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_forecast

        async with AsyncSessionLocal() as session:
            # Đảm bảo có vị trí Đắk Lắk trong database để test
            result = await session.execute(select(Location).where(Location.code == "dak_lak"))
            loc = result.scalars().first()
            if not loc:
                loc = Location(name="Đắk Lắk", code="dak_lak", latitude=12.6667, longitude=108.0333, is_active=True)
                session.add(loc)
                await session.commit()
                await session.refresh(loc)

            # Thực thi việc đồng bộ hóa dữ liệu thời tiết
            service = WeatherService(session)
            await service.fetch_weather_data_background()

            # Kiểm tra xem dự báo đã được lưu hay chưa
            forecast_result = await session.execute(
                select(WeatherForecast).where(WeatherForecast.location_id == loc.id)
            )
            forecasts = forecast_result.scalars().all()
            assert len(forecasts) > 0
            
            # Kiểm tra giá trị tổng hợp
            f = forecasts[0]
            assert f.temperature_min == 20.0
            assert f.temperature_max == 26.0
            assert f.humidity == 77.5  # trung bình của 80 và 75
            assert f.precipitation == 2.0  # tổng của 1.2 và 0.8
            assert f.wind_speed == 3.75  # trung bình của 3.5 và 4.0
            assert f.condition in ["Mưa vừa", "Mưa nhẹ"]

