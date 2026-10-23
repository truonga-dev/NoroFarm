from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, Text, Boolean, DateTime, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Banner(Base):
    """
    Banner quảng cáo / sự kiện trên trang chủ
    """
    __tablename__ = "banner"

    title: Mapped[str] = mapped_column(String(255))
    image_url: Mapped[str] = mapped_column(String(500))
    link_url: Mapped[Optional[str]] = mapped_column(String(500))
    position: Mapped[str] = mapped_column(String(50), default="home_main")
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class Announcement(Base):
    """
    Thông báo hệ thống
    """
    __tablename__ = "announcement"

    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

class SystemSetting(Base):
    """
    Cài đặt hệ thống (Key - Value)
    """
    __tablename__ = "system_setting"

    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(String(255))

class AuditLog(Base):
    """
    Nhật ký hoạt động của hệ thống (Dành cho Admin)
    """
    __tablename__ = "audit_log"

    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), index=True)
    action: Mapped[str] = mapped_column(String(100), index=True)
    resource: Mapped[str] = mapped_column(String(100), index=True)
    resource_id: Mapped[Optional[str]] = mapped_column(String(100))
    details: Mapped[Optional[dict]] = mapped_column(JSON)
    ip_address: Mapped[Optional[str]] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    user: Mapped[Optional["User"]] = relationship(foreign_keys=[user_id])
