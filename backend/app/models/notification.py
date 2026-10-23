from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, ForeignKey, Float, DateTime, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Notification(Base):
    __tablename__ = "notification"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    type: Mapped[str] = mapped_column(String(50), default="system") # system, price_alert
    link: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(backref="notifications")

class PriceAlert(Base):
    __tablename__ = "price_alert"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    commodity_id: Mapped[int] = mapped_column(ForeignKey("commodity.id", ondelete="CASCADE"), index=True)
    target_price: Mapped[float] = mapped_column(Float)
    condition: Mapped[str] = mapped_column(String(20)) # "above", "below"
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(backref="price_alerts")
    commodity: Mapped["Commodity"] = relationship()


class WebPushSubscription(Base):
    __tablename__ = "web_push_subscription"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    endpoint: Mapped[str] = mapped_column(Text, unique=True)
    p256dh: Mapped[str] = mapped_column(String(255))
    auth: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(backref="web_push_subscriptions")

