from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from typing import Optional, List

from app.models.shop import ProductCategory, Product, Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus, PaymentTransaction
from app.schemas.shop import ProductCategoryCreate, ProductCategoryUpdate, ProductCreate, ProductUpdate, OrderCreate

class ShopService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =================
    # CATEGORY METHODS
    # =================
    async def get_categories(self) -> List[ProductCategory]:
        result = await self.db.execute(select(ProductCategory))
        return result.scalars().all()

    async def create_category(self, data: ProductCategoryCreate) -> ProductCategory:
        cat = ProductCategory(**data.model_dump())
        self.db.add(cat)
        await self.db.commit()
        await self.db.refresh(cat)
        from app.core.redis import redis_client
        await redis_client.delete_pattern("shop:*")
        return cat

    async def update_category(self, id: int, data: ProductCategoryUpdate) -> ProductCategory:
        cat = await self.db.get(ProductCategory, id)
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        
        update_data = data.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(cat, k, v)
            
        await self.db.commit()
        await self.db.refresh(cat)
        from app.core.redis import redis_client
        await redis_client.delete_pattern("shop:*")
        return cat

    async def delete_category(self, id: int):
        cat = await self.db.get(ProductCategory, id)
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        await self.db.delete(cat)
        await self.db.commit()
        from app.core.redis import redis_client
        await redis_client.delete_pattern("shop:*")

    # =================
    # PRODUCT METHODS
    # =================
    async def get_products(self, page: int = 1, size: int = 20, category_id: Optional[int] = None, search: Optional[str] = None):
        query = select(Product).options(selectinload(Product.category)).filter(Product.is_active == True)
        
        if category_id:
            query = query.filter(Product.category_id == category_id)
        if search:
            query = query.filter(Product.name.ilike(f"%{search}%"))

        # Total count
        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0

        # Pagination
        query = query.offset((page - 1) * size).limit(size)
        result = await self.db.execute(query)
        items = result.scalars().all()

        pages = (total + size - 1) // size
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": pages
        }

    async def admin_get_products(
        self,
        page: int = 1,
        size: int = 10,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
        stock_status: Optional[str] = None,
        sort: str = "newest",
        low_stock_threshold: int = 20,
    ):
        """Danh sách sản phẩm cho Admin: gồm cả sản phẩm ngừng bán, có bộ lọc & sắp xếp."""
        query = select(Product).options(selectinload(Product.category))

        if category_id:
            query = query.filter(Product.category_id == category_id)
        if search:
            query = query.filter(Product.name.ilike(f"%{search.strip()}%"))
        if is_active is not None:
            query = query.filter(Product.is_active == is_active)
        if stock_status == "out":
            query = query.filter(Product.stock <= 0)
        elif stock_status == "low":
            query = query.filter(Product.stock > 0, Product.stock <= low_stock_threshold)
        elif stock_status == "in":
            query = query.filter(Product.stock > low_stock_threshold)

        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0

        sort_map = {
            "newest": Product.id.desc(),
            "oldest": Product.id.asc(),
            "name_asc": Product.name.asc(),
            "name_desc": Product.name.desc(),
            "price_asc": Product.price.asc(),
            "price_desc": Product.price.desc(),
            "stock_asc": Product.stock.asc(),
            "stock_desc": Product.stock.desc(),
        }
        query = query.order_by(sort_map.get(sort, Product.id.desc()))
        query = query.offset((page - 1) * size).limit(size)
        result = await self.db.execute(query)
        items = result.scalars().all()

        pages = (total + size - 1) // size if total else 0
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": pages,
        }

    async def get_product(self, id: int) -> Product:
        query = select(Product).options(selectinload(Product.category)).filter(Product.id == id)
        result = await self.db.execute(query)
        prod = result.scalars().first()
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")
        return prod

    async def create_product(self, data: ProductCreate) -> Product:
        cat = await self.db.get(ProductCategory, data.category_id)
        if not cat:
            raise HTTPException(status_code=400, detail="Invalid category_id")
            
        prod = Product(**data.model_dump())
        self.db.add(prod)
        await self.db.commit()
        await self.db.refresh(prod)
        return await self.get_product(prod.id)

    async def update_product(self, id: int, data: ProductUpdate) -> Product:
        prod = await self.db.get(Product, id)
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")
            
        if data.category_id is not None:
            cat = await self.db.get(ProductCategory, data.category_id)
            if not cat:
                raise HTTPException(status_code=400, detail="Invalid category_id")

        update_data = data.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(prod, k, v)
            
        await self.db.commit()
        await self.db.refresh(prod)
        return await self.get_product(prod.id)

    async def delete_product(self, id: int):
        prod = await self.db.get(Product, id)
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")
        prod.is_active = False # Soft delete
        await self.db.commit()

    # =================
    # ORDER METHODS
    # =================
    async def create_order(self, user_id: int, data: OrderCreate) -> Order:
        if not data.items:
            raise HTTPException(status_code=400, detail="Order items cannot be empty")

        total_amount = 0
        order_items = []
        
        # Lock products and calculate total with pessimistic lock (SELECT ... FOR UPDATE)
        for item in data.items:
            stmt = select(Product).filter(Product.id == item.product_id).with_for_update()
            result = await self.db.execute(stmt)
            prod = result.scalars().first()
            if not prod or not prod.is_active:
                raise HTTPException(status_code=400, detail=f"Sản phẩm {item.product_id} không tồn tại hoặc đã ngừng kinh doanh")
            
            if prod.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Sản phẩm '{prod.name}' không đủ số lượng trong kho (chỉ còn lại {prod.stock} {prod.unit})"
                )

            # Deduct stock
            prod.stock -= item.quantity
            
            line_total = prod.price * item.quantity
            total_amount += line_total
            
            order_items.append(OrderItem(
                product_id=prod.id,
                quantity=item.quantity,
                price=prod.price
            ))

        # Create Order
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            payment_method=data.payment_method,
            shipping_address=data.shipping_address,
            contact_phone=data.contact_phone,
            notes=data.notes,
            status=OrderStatus.PENDING,
            payment_status=PaymentStatus.UNPAID
        )
        self.db.add(new_order)
        await self.db.flush() # get order id
        
        for oi in order_items:
            oi.order_id = new_order.id
            self.db.add(oi)

        await self.db.commit()
        await self.db.refresh(new_order)
        
        return await self.get_order(new_order.id)

    async def get_order(self, order_id: int) -> Order:
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category)
        ).filter(Order.id == order_id)
        
        result = await self.db.execute(query)
        order = result.scalars().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    async def get_user_orders(self, user_id: int, page: int = 1, size: int = 20):
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category)
        ).filter(Order.user_id == user_id).order_by(Order.created_at.desc())

        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0

        query = query.offset((page - 1) * size).limit(size)
        result = await self.db.execute(query)
        items = result.scalars().all()

        pages = (total + size - 1) // size
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": pages
        }

    async def get_all_orders(self, page: int = 1, size: int = 20, status: Optional[OrderStatus] = None):
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.category)
        ).order_by(Order.created_at.desc())

        if status:
            query = query.filter(Order.status == status)

        count_query = select(func.count()).select_from(query.subquery())
        total = await self.db.scalar(count_query) or 0

        query = query.offset((page - 1) * size).limit(size)
        result = await self.db.execute(query)
        items = result.scalars().all()

        pages = (total + size - 1) // size
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": pages
        }

    async def update_order_status(self, order_id: int, status: OrderStatus) -> Order:
        order = await self.get_order(order_id)
        
        # If cancelled, restock items
        if status == OrderStatus.CANCELLED and order.status != OrderStatus.CANCELLED:
            for item in order.items:
                prod = await self.db.get(Product, item.product_id)
                if prod:
                    prod.stock += item.quantity
        
        # If paying
        if status == OrderStatus.COMPLETED:
            order.payment_status = PaymentStatus.PAID
            
        order.status = status
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def create_payment_transaction(
        self,
        order_id: int,
        stripe_session_id: str,
        amount: float,
        currency: str = "VND",
        status: str = "pending"
    ) -> PaymentTransaction:
        tx = PaymentTransaction(
            order_id=order_id,
            stripe_session_id=stripe_session_id,
            amount=amount,
            currency=currency,
            status=status
        )
        self.db.add(tx)
        await self.db.commit()
        await self.db.refresh(tx)
        return tx

    async def complete_stripe_payment(
        self,
        stripe_session_id: str,
        stripe_charge_id: str,
        stripe_customer_id: str,
        amount: float,
        payment_method_types: list
    ) -> bool:
        result = await self.db.execute(
            select(PaymentTransaction).filter(PaymentTransaction.stripe_session_id == stripe_session_id)
        )
        tx = result.scalars().first()
        if not tx:
            return False
            
        tx.stripe_charge_id = stripe_charge_id
        tx.stripe_customer_id = stripe_customer_id
        tx.status = "succeeded"
        tx.payment_method_types = payment_method_types
        
        order = await self.db.get(Order, tx.order_id)
        if order:
            order.payment_status = PaymentStatus.PAID
            order.status = OrderStatus.CONFIRMED
            
        await self.db.commit()
        return True

