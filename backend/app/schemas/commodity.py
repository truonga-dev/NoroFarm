from typing import List, Optional, TypeVar, Generic
from datetime import datetime
from pydantic import BaseModel, Field

T = TypeVar("T")

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_desc: bool = False

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class CommodityBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    unit: str
    category_id: int

class CommodityCreate(CommodityBase):
    pass

class CommodityUpdate(CommodityBase):
    code: Optional[str] = None
    name: Optional[str] = None
    unit: Optional[str] = None
    category_id: Optional[int] = None

class PriceBase(BaseModel):
    commodity_id: int
    price: float
    currency: str = "VND"
    location: Optional[str] = None
    date: Optional[datetime] = None

class PriceCreate(PriceBase):
    pass

class BulkPriceCreate(BaseModel):
    prices: List[PriceCreate]

class PriceUpdate(BaseModel):
    price: Optional[float] = None
    currency: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None

class PriceResponse(PriceBase):
    id: int
    date: datetime
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class OverviewPriceResponse(BaseModel):
    price: float
    currency: str
    location: Optional[str] = None
    date: datetime

class CommodityOverviewResponse(BaseModel):
    id: int
    code: str
    name: str
    unit: str
    prices: List[OverviewPriceResponse] = Field(default_factory=list)

class CommodityResponse(CommodityBase):
    id: int
    created_at: datetime
    updated_at: datetime
    current_price: Optional[float] = None
    prev_price: Optional[float] = None
    price_change: Optional[float] = 0.0
    change_24h: Optional[float] = 0.0
    price_change_percent: Optional[float] = 0.0
    location: Optional[str] = None
    category: Optional[CategoryResponse] = None
    prices: List[PriceResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}

class HistoryResponse(BaseModel):
    id: int
    commodity_id: int
    action: str
    changes: Optional[str] = None
    user_id: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class PriceHistoryPoint(BaseModel):
    date: datetime
    price: float
    currency: str = "VND"
    location: Optional[str] = None

    model_config = {"from_attributes": True}

class TopMoverResponse(BaseModel):
    id: int
    code: str
    name: str
    unit: str
    category: Optional[str] = None
    current_price: float
    prev_price: Optional[float] = None
    change_pct: Optional[float] = None
    currency: str = "VND"
    updated_at: datetime

class WorldPriceItem(BaseModel):
    code: str
    name: str
    exchange: str
    price_original: float
    original_unit: str
    price_vnd_kg: float
    change_original: float
    change_percent: float
    direction: str = "UP"  # "UP", "DOWN", "FLAT"
    contract_month: Optional[str] = None
    volume: Optional[str] = None
    updated_at: str

class DomesticPriceItem(BaseModel):
    code: str
    name: str
    location: str
    price_vnd_kg: float
    change_vnd: float
    change_percent: float
    direction: str = "UP"
    updated_at: str

class BasisSpreadItem(BaseModel):
    pair: str
    world_name: str
    domestic_name: str
    world_vnd_kg: float
    domestic_vnd_kg: float
    spread_vnd_kg: float
    spread_percent: float
    status: str  # "discount", "premium", "parity"
    assessment: str

class WorldDomesticBoardResponse(BaseModel):
    exchange_rate_usd_vnd: Optional[float] = None
    exchange_rate_updated: Optional[str] = None
    world_items: List[WorldPriceItem]
    domestic_items: List[DomesticPriceItem]
    basis_spreads: List[BasisSpreadItem]
    timestamp: str
