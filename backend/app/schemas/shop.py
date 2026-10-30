from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.shop import OrderStatus, PaymentMethod, PaymentStatus

# ProductCategory Schemas
class ProductCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProductCategoryCreate(ProductCategoryBase):
    pass

class ProductCategoryUpdate(ProductCategoryBase):
    name: Optional[str] = None

class ProductCategoryResponse(ProductCategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

# Product Schemas
class ProductBase(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    unit: str
    image_url: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    category: Optional[ProductCategoryResponse] = None

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    size: int
    pages: int

# OrderItem Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductResponse] = None

# Order Schemas
class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    payment_method: PaymentMethod = PaymentMethod.COD
    shipping_address: str
    contact_phone: str
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    total_amount: float
    status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    shipping_address: str
    contact_phone: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]

class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    size: int
    pages: int
