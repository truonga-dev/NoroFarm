from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc

from app.database.database import get_db
from app.models.notification import Notification, PriceAlert, WebPushSubscription
from app.models.commodity import Commodity
from app.models.user import User
from app.dependencies.auth import get_current_active_user
from app.common import ResponseModel, success_response, CustomException
from app.core.config import settings
from pydantic import BaseModel, ConfigDict
from datetime import datetime

router = APIRouter()

class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    message: str
    is_read: bool
    type: str
    link: Optional[str] = None
    created_at: datetime
    
class AlertCommodityInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    unit: str
    current_price: Optional[float] = None
    price_change_percent: Optional[float] = 0.0

class PriceAlertCreate(BaseModel):
    commodity_id: int
    target_price: float
    condition: str # "above" or "below"

class PriceAlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    commodity_id: int
    target_price: float
    condition: str
    is_active: bool
    is_triggered: bool = False
    created_at: datetime
    commodity: Optional[AlertCommodityInfo] = None
    

class WebPushKeys(BaseModel):
    p256dh: str
    auth: str


class WebPushSubscriptionCreate(BaseModel):
    endpoint: str
    keys: WebPushKeys


class WebPushSubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    endpoint: str
    p256dh: str
    auth: str
    created_at: datetime
    

@router.get("", response_model=ResponseModel[List[NotificationResponse]])
async def get_notifications(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Lấy danh sách thông báo của user hiện tại"""
    result = await db.execute(
        select(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(desc(Notification.created_at))
        .offset(skip)
        .limit(limit)
    )
    notifications = result.scalars().all()
    
    # Lấy số lượng chưa đọc
    unread_result = await db.execute(
        select(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False)
    )
    unread_count = len(unread_result.scalars().all())
    
    return success_response(
        data=notifications,
        message="Lấy thông báo thành công",
        meta={"unread_count": unread_count}
    )

@router.post("/{notification_id}/read", response_model=ResponseModel)
async def mark_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id)
    )
    notification = result.scalars().first()
    if not notification:
        raise CustomException(status_code=404, message="Không tìm thấy thông báo")
        
    notification.is_read = True
    await db.commit()
    return success_response(data=True, message="Đã đánh dấu đọc")

@router.post("/read-all", response_model=ResponseModel)
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False)
    )
    for notification in result.scalars().all():
        notification.is_read = True
    await db.commit()
    return success_response(data=True, message="Đã đánh dấu đọc tất cả")

def _serialize_alert(alert: PriceAlert) -> dict:
    com = alert.commodity
    cur_price = float(com.current_price) if (com and com.current_price is not None) else None
    is_triggered = False
    if cur_price is not None and alert.is_active:
        is_triggered = (
            (alert.condition == "above" and cur_price >= float(alert.target_price))
            or (alert.condition == "below" and cur_price <= float(alert.target_price))
        )
    return {
        "id": alert.id,
        "commodity_id": alert.commodity_id,
        "target_price": alert.target_price,
        "condition": alert.condition,
        "is_active": alert.is_active,
        "is_triggered": is_triggered,
        "created_at": alert.created_at,
        "commodity": {
            "id": com.id,
            "code": com.code,
            "name": com.name,
            "unit": com.unit,
            "current_price": cur_price,
            "price_change_percent": com.price_change_percent,
        } if com else None,
    }


# Price Alerts API
@router.get("/alerts", response_model=ResponseModel[List[PriceAlertResponse]])
async def get_price_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(PriceAlert)
        .options(selectinload(PriceAlert.commodity).selectinload(Commodity.prices))
        .filter(PriceAlert.user_id == current_user.id)
        .order_by(desc(PriceAlert.created_at))
    )
    alerts = result.scalars().all()
    return success_response(data=[_serialize_alert(a) for a in alerts])

@router.post("/alerts", response_model=ResponseModel[PriceAlertResponse])
async def create_price_alert(
    data: PriceAlertCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    alert = PriceAlert(
        user_id=current_user.id,
        commodity_id=data.commodity_id,
        target_price=data.target_price,
        condition=data.condition
    )
    db.add(alert)
    await db.commit()

    # Kiểm tra kích hoạt ngay nếu giá hiện tại đã khớp
    from app.tasks.crawlers import evaluate_price_alerts
    await evaluate_price_alerts(user_id=current_user.id)

    res = await db.execute(
        select(PriceAlert)
        .options(selectinload(PriceAlert.commodity).selectinload(Commodity.prices))
        .filter(PriceAlert.id == alert.id)
    )
    loaded_alert = res.scalars().first()
    return success_response(data=_serialize_alert(loaded_alert), message="Đã tạo cảnh báo giá")

@router.patch("/alerts/{alert_id}/toggle", response_model=ResponseModel[PriceAlertResponse])
async def toggle_price_alert(
    alert_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(PriceAlert)
        .options(selectinload(PriceAlert.commodity).selectinload(Commodity.prices))
        .filter(PriceAlert.id == alert_id, PriceAlert.user_id == current_user.id)
    )
    alert = result.scalars().first()
    if not alert:
        raise CustomException(status_code=404, message="Không tìm thấy cảnh báo")
    alert.is_active = not alert.is_active
    await db.commit()
    return success_response(data=_serialize_alert(alert), message="Đã cập nhật trạng thái cảnh báo")

@router.post("/alerts/evaluate", response_model=ResponseModel[dict])
async def evaluate_my_alerts(
    current_user: User = Depends(get_current_active_user)
):
    from app.tasks.crawlers import evaluate_price_alerts
    triggered = await evaluate_price_alerts(user_id=current_user.id)
    return success_response(
        data={"triggered_count": triggered},
        message=f"Đã quét giá thị trường 2026: {triggered} cảnh báo khớp ngưỡng mục tiêu."
    )

@router.delete("/alerts/{alert_id}", response_model=ResponseModel)
async def delete_price_alert(
    alert_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(PriceAlert).filter(PriceAlert.id == alert_id, PriceAlert.user_id == current_user.id)
    )
    alert = result.scalars().first()
    if not alert:
        raise CustomException(status_code=404, message="Không tìm thấy cảnh báo")
        
    await db.delete(alert)
    await db.commit()
    return success_response(data=True, message="Đã xóa cảnh báo")


@router.post("/push/subscribe", response_model=ResponseModel[WebPushSubscriptionResponse])
async def subscribe_push(
    data: WebPushSubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Kiểm tra xem endpoint đăng ký này đã tồn tại chưa, nếu rồi thì cập nhật
    result = await db.execute(
        select(WebPushSubscription).filter(WebPushSubscription.endpoint == data.endpoint)
    )
    existing_sub = result.scalars().first()
    
    if existing_sub:
        existing_sub.user_id = current_user.id
        existing_sub.p256dh = data.keys.p256dh
        existing_sub.auth = data.keys.auth
        db.add(existing_sub)
        await db.commit()
        await db.refresh(existing_sub)
        return success_response(data=existing_sub, message="Cập nhật đăng ký nhận thông báo đẩy thành công")
    
    new_sub = WebPushSubscription(
        user_id=current_user.id,
        endpoint=data.endpoint,
        p256dh=data.keys.p256dh,
        auth=data.keys.auth
    )
    db.add(new_sub)
    await db.commit()
    await db.refresh(new_sub)
    return success_response(data=new_sub, message="Đăng ký nhận thông báo đẩy thành công")


@router.get("/push/vapid-key", response_model=ResponseModel[dict])
async def get_vapid_public_key():
    """Lấy public key VAPID cho client đăng ký PushManager"""
    return success_response(data={"public_key": settings.VAPID_PUBLIC_KEY})


