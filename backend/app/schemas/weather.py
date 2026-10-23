from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class LocationBase(BaseModel):
    """Lược đồ cơ sở cho Vị trí"""
    name: str
    code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: bool = True

class LocationCreate(LocationBase):
    """Lược đồ khi tạo mới Vị trí"""
    pass

class LocationResponse(LocationBase):
    """Lược đồ trả về thông tin Vị trí"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class WeatherForecastBase(BaseModel):
    """Lược đồ cơ sở cho Dự báo thời tiết"""
    location_id: int
    forecast_date: datetime
    temperature_min: float
    temperature_max: float
    humidity: float
    precipitation: float
    wind_speed: float
    condition: str
    icon_url: Optional[str] = None

class WeatherForecastCreate(WeatherForecastBase):
    """Lược đồ khi tạo mới dự báo"""
    pass

class WeatherForecastResponse(WeatherForecastBase):
    """Lược đồ trả về dự báo thời tiết"""
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

class WeatherAlertBase(BaseModel):
    """Lược đồ cơ sở cho Cảnh báo thời tiết"""
    location_id: int
    title: str
    description: str
    severity: str
    start_time: datetime
    end_time: datetime
    is_active: bool = True

class WeatherAlertCreate(WeatherAlertBase):
    """Lược đồ khi tạo mới cảnh báo"""
    pass

class WeatherAlertResponse(WeatherAlertBase):
    """Lược đồ trả về cảnh báo thời tiết"""
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}
