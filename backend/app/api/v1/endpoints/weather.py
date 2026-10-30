from typing import List, Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.weather import LocationResponse, WeatherForecastResponse, WeatherAlertResponse
from app.services.weather import WeatherService
from app.services.weather_client import weather_client
from app.common import ResponseModel, success_response, error_response, CustomException

router = APIRouter()

@router.get("/current")
async def get_current_weather(request: Request, city: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None):
    """API lấy thời tiết hiện tại dựa trên tên thành phố, tọa độ hoặc IP"""
    if lat is not None and lon is not None:
        # Gọi API thời tiết trực tiếp bằng tọa độ chính xác
        data = await weather_client.get_weather_by_coords(lat, lon)
    elif city:
        data = await weather_client.get_weather_by_city(city)
    else:
        # Lấy IP của người dùng
        client_ip = request.headers.get('x-forwarded-for') or (request.client.host if request.client else "127.0.0.1")
        location_data = await weather_client.get_location_from_ip(client_ip)
        
        # Gọi API thời tiết theo tọa độ từ IP
        if location_data and "lat" in location_data and "lon" in location_data:
            data = await weather_client.get_weather_by_coords(location_data["lat"], location_data["lon"])
        else:
            data = None

    if not data:
        data = weather_client._fallback_weather(city or "Tây Nguyên")
            
    # Format data trả về cho frontend
    formatted_data = {
        "location": data.get("name"),
        "temperature": data.get("main", {}).get("temp"),
        "humidity": data.get("main", {}).get("humidity"),
        "wind_speed": data.get("wind", {}).get("speed"),
        "condition": data.get("weather", [{}])[0].get("description", "").capitalize(),
        "icon_url": f"https://openweathermap.org/img/wn/{data.get('weather', [{}])[0].get('icon')}@2x.png" if data.get("weather") else None
    }
    
    return success_response(data=formatted_data)

@router.get("/locations", response_model=ResponseModel[List[LocationResponse]])
async def get_locations(db: AsyncSession = Depends(get_db)):
    """API lấy danh sách các vị trí hỗ trợ xem thời tiết"""
    service = WeatherService(db)
    locations = await service.get_locations()
    return success_response(data=locations)

@router.get("/forecasts/{location_code}", response_model=ResponseModel[List[WeatherForecastResponse]])
async def get_weather_forecast(location_code: str, db: AsyncSession = Depends(get_db)):
    """API lấy dự báo thời tiết cho một vị trí cụ thể"""
    service = WeatherService(db)
    forecasts = await service.get_forecast(location_code)
    return success_response(data=forecasts)

@router.get("/alerts/{location_code}", response_model=ResponseModel[List[WeatherAlertResponse]])
async def get_weather_alerts(location_code: str, db: AsyncSession = Depends(get_db)):
    """API lấy các cảnh báo thời tiết (bão, ngập lụt...) cho một vị trí cụ thể"""
    service = WeatherService(db)
    alerts = await service.get_alerts(location_code)
    return success_response(data=alerts)
