from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.user import UserResponse, UserUpdate, UserChangePassword
from app.models.user import User
from app.models.commodity import Commodity
from app.dependencies.auth import get_current_active_user
from app.common import ResponseModel, success_response, error_response, CustomException
from app.core.security import verify_password, get_password_hash

router = APIRouter()


@router.get("/me", response_model=ResponseModel[UserResponse])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return success_response(data=current_user, message="Lấy thông tin người dùng thành công")


@router.patch("/me", response_model=ResponseModel[UserResponse])
async def update_users_me(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Cập nhật thông tin cá nhân của user hiện tại."""
    # Cập nhật profile nếu có
    if current_user.profile and (data.full_name is not None or hasattr(data, 'phone_number') or hasattr(data, 'avatar_url')):
        if data.full_name is not None:
            current_user.profile.full_name = data.full_name
        # Kiểm tra thêm các trường profile khác nếu có trong UserUpdate
        phone = getattr(data, 'phone_number', None)
        avatar = getattr(data, 'avatar_url', None)
        if phone is not None:
            current_user.profile.phone_number = phone
        if avatar is not None:
            current_user.profile.avatar_url = avatar

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return success_response(data=current_user, message="Cập nhật thông tin thành công")

@router.patch("/me/password", response_model=ResponseModel)
async def change_password(
    data: UserChangePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Đổi mật khẩu người dùng."""
    if not verify_password(data.old_password, current_user.hashed_password):
        raise CustomException(status_code=400, message="Mật khẩu cũ không chính xác")
        
    current_user.hashed_password = get_password_hash(data.new_password)
    db.add(current_user)
    await db.commit()
    
    return success_response(data=True, message="Đổi mật khẩu thành công")


@router.get("/me/watchlist", response_model=ResponseModel[list])
async def get_watchlist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Lấy danh sách nông sản đang theo dõi kèm giá thị trường 2026 mới nhất."""
    from sqlalchemy.future import select
    from sqlalchemy.orm import selectinload

    watched_ids = [c.id for c in current_user.watchlist_commodities]
    if not watched_ids:
        return success_response(data=[], message="Lấy danh sách theo dõi thành công")

    stmt = (
        select(Commodity)
        .options(selectinload(Commodity.prices), selectinload(Commodity.category))
        .where(Commodity.id.in_(watched_ids))
    )
    result = await db.execute(stmt)
    commodities = result.scalars().all()

    data = [
        {
            "id": c.id,
            "code": c.code,
            "name": c.name,
            "unit": c.unit,
            "category_id": c.category_id,
            "category_name": c.category.name if c.category else None,
            "current_price": c.current_price,
            "previous_price": c.previous_price,
            "price_change": c.price_change,
            "price_change_percent": c.price_change_percent,
        }
        for c in commodities
    ]
    return success_response(data=data, message="Lấy danh sách theo dõi thành công")


@router.post("/me/watchlist/{commodity_id}", response_model=ResponseModel)
async def add_to_watchlist(
    commodity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Thêm nông sản vào danh sách theo dõi."""
    # Check if commodity exists
    from sqlalchemy.future import select
    result = await db.execute(select(Commodity).filter(Commodity.id == commodity_id))
    commodity = result.scalars().first()
    
    if not commodity:
        raise CustomException(status_code=404, message="Nông sản không tồn tại")
        
    # Check if already in watchlist
    if any(c.id == commodity_id for c in current_user.watchlist_commodities):
        return success_response(data=None, message="Nông sản đã có trong danh sách theo dõi")
        
    current_user.watchlist_commodities.append(commodity)
    db.add(current_user)
    await db.commit()
    
    return success_response(data={"added": True}, message="Đã thêm vào danh sách theo dõi")


@router.delete("/me/watchlist/{commodity_id}", response_model=ResponseModel)
async def remove_from_watchlist(
    commodity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Xóa nông sản khỏi danh sách theo dõi."""
    # Find in watchlist
    target = next((c for c in current_user.watchlist_commodities if c.id == commodity_id), None)
    
    if not target:
        raise CustomException(status_code=404, message="Nông sản không có trong danh sách theo dõi")
        
    current_user.watchlist_commodities.remove(target)
    db.add(current_user)
    await db.commit()
    
    return success_response(data={"removed": True}, message="Đã xóa khỏi danh sách theo dõi")
