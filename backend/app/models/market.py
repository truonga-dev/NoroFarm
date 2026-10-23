from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class PostType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class PostStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class MarketPost(Base):
    __tablename__ = "market_posts"

    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False, index=True)
    commodity_id = Column(Integer, ForeignKey("commodity.id", ondelete="CASCADE"), nullable=False, index=True)
    
    post_type = Column(SQLEnum(PostType), nullable=False, index=True)
    status = Column(SQLEnum(PostStatus), nullable=False, default=PostStatus.PENDING, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)  # kg, tấn, etc.
    
    location = Column(String(255), nullable=True, index=True)
    contact_phone = Column(String(20), nullable=True)
    
    is_active = Column(Boolean, default=True, index=True)

    # Relationships
    user = relationship("User", backref="market_posts")
    commodity = relationship("Commodity", backref="market_posts")
