from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.market import PostType, PostStatus
from app.schemas.commodity import CommodityResponse
from app.schemas.user import UserResponse

class MarketPostBase(BaseModel):
    commodity_id: int
    post_type: PostType
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    price: float
    quantity: float
    unit: str = Field(..., max_length=50)
    location: Optional[str] = None
    contact_phone: Optional[str] = None

class MarketPostCreate(MarketPostBase):
    pass

class MarketPostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    location: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: Optional[bool] = None

class MarketPostResponse(MarketPostBase):
    id: int
    user_id: int
    is_active: bool
    status: PostStatus
    created_at: datetime
    updated_at: datetime
    
    # Nested relations if needed
    commodity: Optional[CommodityResponse] = None
    user: Optional[UserResponse] = None

    model_config = {"from_attributes": True}

class MarketPostListResponse(BaseModel):
    items: List[MarketPostResponse]
    total: int
    page: int
    size: int
    pages: int
