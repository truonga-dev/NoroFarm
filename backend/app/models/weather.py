from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, Float, DateTime, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Location(Base):
    """
    Bảng lưu trữ thông tin Vị trí (Tỉnh/Thành phố, Quận/Huyện)
    Dùng để truy vấn thời tiết theo khu vực
    """
    __tablename__ = "location"

    name: Mapped[str] = mapped_column(String(255), index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float)
    longitude: Mapped[Optional[float]] = mapped_column(Float)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    forecasts: Mapped[List["WeatherForecast"]] = relationship(back_populates="location", cascade="all, delete-orphan")
    alerts: Mapped[List["WeatherAlert"]] = relationship(back_populates="location", cascade="all, delete-orphan")

class WeatherForecast(Base):
    """
    Bảng dự báo thời tiết cho các vị trí
    """
    __tablename__ = "weather_forecast"

    location_id: Mapped[int] = mapped_column(ForeignKey("location.id", ondelete="CASCADE"), index=True)
    forecast_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    temperature_min: Mapped[float] = mapped_column(Float)
    temperature_max: Mapped[float] = mapped_column(Float)
    humidity: Mapped[float] = mapped_column(Float)
    precipitation: Mapped[float] = mapped_column(Float)  # Lượng mưa
    wind_speed: Mapped[float] = mapped_column(Float)
    condition: Mapped[str] = mapped_column(String(100))  # Tình trạng (ví dụ: Mưa, Nắng)
    icon_url: Mapped[Optional[str]] = mapped_column(String(255))

    location: Mapped["Location"] = relationship(back_populates="forecasts")

class WeatherAlert(Base):
    """
    Bảng cảnh báo thời tiết (bão, lũ, hạn hán...)
    """
    __tablename__ = "weather_alert"

    location_id: Mapped[int] = mapped_column(ForeignKey("location.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Text] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(50))  # Mức độ nghiêm trọng
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    location: Mapped["Location"] = relationship(back_populates="alerts")
