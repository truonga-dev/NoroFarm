from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, Float, DateTime, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class CommodityCategory(Base):
    __tablename__ = "commodity_category"

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("commodity_category.id", ondelete="SET NULL"))

    parent: Mapped[Optional["CommodityCategory"]] = relationship(remote_side="CommodityCategory.id", back_populates="children")
    children: Mapped[List["CommodityCategory"]] = relationship(back_populates="parent")
    commodities: Mapped[List["Commodity"]] = relationship(back_populates="category")

class Commodity(Base):
    __tablename__ = "commodity"
    __table_args__ = (
        Index("ix_commodity_category_fk", "category_id"),
    )

    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    unit: Mapped[str] = mapped_column(String(50))
    category_id: Mapped[int] = mapped_column(ForeignKey("commodity_category.id", ondelete="RESTRICT"))

    category: Mapped["CommodityCategory"] = relationship(back_populates="commodities")
    prices: Mapped[List["CommodityPrice"]] = relationship(back_populates="commodity", cascade="all, delete-orphan")
    histories: Mapped[List["CommodityHistory"]] = relationship(back_populates="commodity", cascade="all, delete-orphan")

    def _sorted_prices(self) -> List["CommodityPrice"]:
        if not self.prices:
            return []
        return sorted(self.prices, key=lambda p: (p.date, p.id or 0), reverse=True)

    @property
    def current_price(self) -> Optional[float]:
        sp = self._sorted_prices()
        return sp[0].price if sp else None

    @property
    def prev_price(self) -> Optional[float]:
        sp = self._sorted_prices()
        if len(sp) < 2:
            return None
        curr = sp[0].price
        for p in sp[1:]:
            if p.price != curr:
                return p.price
        return sp[1].price

    @property
    def price_change(self) -> float:
        curr = self.current_price
        prev = self.prev_price
        if curr is None or prev is None:
            return 0.0
        return round(curr - prev, 2)

    @property
    def change_24h(self) -> float:
        return self.price_change

    @property
    def price_change_percent(self) -> Optional[float]:
        curr = self.current_price
        prev = self.prev_price
        if curr is None or prev is None or prev <= 0:
            return 0.0
        return round(((curr - prev) / prev) * 100, 2)

    @property
    def location(self) -> Optional[str]:
        sp = self._sorted_prices()
        return sp[0].location if sp else None

class CommodityPrice(Base):
    __tablename__ = "commodity_price"
    __table_args__ = (
        Index("ix_commodity_price_cid_date", "commodity_id", "date"),
    )

    commodity_id: Mapped[int] = mapped_column(ForeignKey("commodity.id", ondelete="CASCADE"), index=True)
    price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(10), default="VND")
    location: Mapped[Optional[str]] = mapped_column(String(255), index=True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    commodity: Mapped["Commodity"] = relationship(back_populates="prices")

class CommodityHistory(Base):
    __tablename__ = "commodity_history"

    commodity_id: Mapped[int] = mapped_column(ForeignKey("commodity.id", ondelete="CASCADE"), index=True)
    action: Mapped[str] = mapped_column(String(50))  # e.g., created, updated, price_changed
    changes: Mapped[Optional[str]] = mapped_column(Text)  # JSON string of changes
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"))
    
    commodity: Mapped["Commodity"] = relationship(back_populates="histories")
