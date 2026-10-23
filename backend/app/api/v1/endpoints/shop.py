from fastapi import APIRouter, Depends, Query, Path, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
import stripe

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.shop import OrderStatus
from app.common import ResponseModel, success_response, error_response, CustomException
from app.schemas.shop import (
    ProductCategoryResponse, ProductResponse, ProductListResponse,
    OrderCreate, OrderResponse, OrderListResponse
)
from app.services.shop import ShopService
from app.core.config import settings

router = APIRouter()

# --- Categories ---
@router.get("/categories", response_model=ResponseModel[List[ProductCategoryResponse]])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách danh mục sản phẩm (B2C)"""
    service = ShopService(db)
    result = await service.get_categories()
    return success_response(data=result)

# --- Products ---
@router.get("/products", response_model=ResponseModel[ProductListResponse])
async def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Lấy danh sách sản phẩm (B2C)"""
    service = ShopService(db)
    result = await service.get_products(page=page, size=size, category_id=category_id, search=search)
    return success_response(data=result)

@router.get("/products/{id}", response_model=ResponseModel[ProductResponse])
async def get_product_by_id(
    id: int = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Lấy chi tiết sản phẩm"""
    service = ShopService(db)
    result = await service.get_product(id)
    return success_response(data=result)

# --- Orders ---
@router.post("/orders", response_model=ResponseModel[OrderResponse])
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Đặt hàng (B2C)"""
    service = ShopService(db)
    result = await service.create_order(current_user.id, data)
    return success_response(data=result, message="Đặt hàng thành công")

@router.get("/orders/me", response_model=ResponseModel[OrderListResponse])
async def get_my_orders(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy lịch sử đơn hàng của tôi"""
    service = ShopService(db)
    result = await service.get_user_orders(current_user.id, page=page, size=size)
    return success_response(data=result)

@router.get("/orders/me/{id}", response_model=ResponseModel[OrderResponse])
async def get_my_order_detail(
    id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy chi tiết đơn hàng của tôi"""
    service = ShopService(db)
    order = await service.get_order(id)
    # Validate owner
    if order.user_id != current_user.id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not allowed to view this order")
    return success_response(data=order)

@router.patch("/orders/me/{id}/cancel", response_model=ResponseModel[OrderResponse])
async def cancel_my_order(
    id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Hủy đơn hàng (chỉ khi đang PENDING)"""
    service = ShopService(db)
    order = await service.get_order(id)
    from fastapi import HTTPException
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    if order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Chỉ có thể hủy đơn hàng đang chờ xác nhận")
        
    result = await service.update_order_status(id, OrderStatus.CANCELLED)
    return success_response(data=result, message="Hủy đơn hàng thành công")


# --- Stripe Payment API ---
@router.post("/orders/{order_id}/stripe-session")
async def create_stripe_session(
    order_id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Tạo Stripe Checkout Session cho đơn hàng và trả về link thanh toán"""
    service = ShopService(db)
    order = await service.get_order(order_id)
    
    if order.user_id != current_user.id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Không có quyền truy cập đơn hàng này")
        
    if not settings.STRIPE_API_KEY:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Stripe API Key chưa được cấu hình. Kiểm tra file .env")
        
    stripe.api_key = settings.STRIPE_API_KEY
    
    # Tạo line items cho Stripe
    line_items = []
    for item in order.items:
        line_items.append({
            "price_data": {
                "currency": "vnd",
                "product_data": {
                    "name": item.product.name,
                    "images": [item.product.image_url] if item.product.image_url else [],
                },
                "unit_amount": int(item.price), # Stripe VND unit_amount là VND trực tiếp
            },
            "quantity": item.quantity,
        })
        
    # Tính phí ship gián tiếp (total - tổng tiền hàng)
    items_total = sum(oi.price * oi.quantity for oi in order.items)
    shipping_fee = order.total_amount - items_total
    if shipping_fee > 0:
        line_items.append({
            "price_data": {
                "currency": "vnd",
                "product_data": {
                    "name": "Phí vận chuyển",
                },
                "unit_amount": int(shipping_fee),
            },
            "quantity": 1,
        })
        
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/checkout?success=true&order_id={order_id}",
            cancel_url=f"{settings.FRONTEND_URL}/checkout?cancelled=true&order_id={order_id}",
            metadata={
                "order_id": order_id,
                "user_id": current_user.id
            }
        )
        
        # Lưu log giao dịch Stripe
        await service.create_payment_transaction(
            order_id=order_id,
            stripe_session_id=session.id,
            amount=order.total_amount,
            currency="VND",
            status="pending"
        )
        
        return success_response(data={"session_url": session.url}, message="Tạo phiên thanh toán thành công")
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Lỗi khởi tạo Stripe Session: {str(e)}")


@router.post("/webhook/stripe")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Stripe Webhook để lắng nghe thanh toán thành công"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Thiếu Stripe-Signature header")
        
    if not settings.STRIPE_WEBHOOK_SECRET:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Stripe Webhook Secret chưa được cấu hình. Kiểm tra file .env")
        
    event = None
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Payload không hợp lệ")
    except stripe.error.SignatureVerificationError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Chữ ký webhook không hợp lệ")
        
    # Xử lý sự kiện
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        
        stripe_session_id = session.get("id")
        stripe_charge_id = session.get("payment_intent")
        stripe_customer_id = session.get("customer")
        amount_total = session.get("amount_total", 0) # Stripe trả về VND trực tiếp (amount_total là VND)
        payment_method_types = session.get("payment_method_types", [])
        
        service = ShopService(db)
        # Hoàn tất giao dịch
        success = await service.complete_stripe_payment(
            stripe_session_id=stripe_session_id,
            stripe_charge_id=stripe_charge_id,
            stripe_customer_id=stripe_customer_id,
            amount=float(amount_total),
            payment_method_types=payment_method_types
        )
        if success:
            return success_response(data=True, message="Đã xử lý thanh toán đơn hàng thành công")
        else:
            raise CustomException(status_code=404, message="Không tìm thấy transaction log tương ứng cho session này")
            
    return success_response(data=True, message="Webhook tiếp nhận sự kiện")
