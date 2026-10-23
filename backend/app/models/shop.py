from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

from app.models.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    SHIPPING = "SHIPPING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PaymentMethod(str, enum.Enum):
    COD = "COD"
    VNPAY = "VNPAY"
    MOMO = "MOMO"
    STRIPE = "STRIPE"

class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"
    FAILED = "FAILED"

class ProductCategory(Base):
    __tablename__ = "product_categories"

    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    category_id = Column(Integer, ForeignKey("product_categories.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, index=True)
    stock = Column(Integer, default=0)
    unit = Column(String(50), nullable=False) # e.g., kg, bao, lít
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, index=True)

    category = relationship("ProductCategory", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, index=True)
    total_amount = Column(Float, nullable=False, default=0.0)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, index=True)
    
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.COD)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    
    shipping_address = Column(String(500), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    
    user = relationship("User", backref="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False) # Lịch sử giá tại thời điểm mua

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    stripe_session_id = Column(String(255), nullable=True, unique=True, index=True)
    stripe_charge_id = Column(String(255), nullable=True, index=True)
    stripe_customer_id = Column(String(255), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="VND")
    status = Column(String(50), nullable=False) # succeeded, pending, failed
    payment_method_types = Column(JSON, nullable=True) # e.g. ["card"]

    order = relationship("Order", backref="transactions")

