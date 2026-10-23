from typing import Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.market import MarketPostCreate, MarketPostUpdate, MarketPostResponse, MarketPostListResponse
from app.services.market import MarketService
from app.common.response import ResponseModel, success_response
from app.dependencies.auth import get_current_active_user, RoleChecker
from app.models.user import User
from app.models.market import PostType, PostStatus

router = APIRouter()

@router.get("", response_model=ResponseModel[MarketPostListResponse])
async def get_market_posts(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    post_type: Optional[PostType] = None,
    commodity_id: Optional[int] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Lấy danh sách tin đăng trên Sàn giao dịch"""
    service = MarketService(db)
    result = await service.get_posts(page, size, post_type, commodity_id, search, PostStatus.APPROVED)
    return success_response(data=result)

@router.get("/me", response_model=ResponseModel[MarketPostListResponse])
async def get_my_posts(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    post_type: Optional[PostType] = None,
    status: Optional[PostStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Lấy danh sách tin đăng của CHÍNH MÌNH (kể cả Pending/Rejected)"""
    service = MarketService(db)
    result = await service.get_posts(
        page=page,
        size=size,
        post_type=post_type,
        status=status,
        user_id=current_user.id
    )
    return success_response(data=result)

@router.get("/{post_id}", response_model=ResponseModel[MarketPostResponse])
async def get_market_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Lấy chi tiết tin đăng"""
    service = MarketService(db)
    post = await service.get_post(post_id)
    return success_response(data=post)

@router.post("", response_model=ResponseModel[MarketPostResponse], status_code=status.HTTP_201_CREATED)
async def create_market_post(
    data: MarketPostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Tạo tin đăng mới (Chỉ Admin hoặc User có quyền seller)"""
    # Kiểm tra quyền đăng bài
    user_roles = [role.name for role in getattr(current_user, 'roles', [])]
    if "admin" not in user_roles and "seller" not in user_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền đăng tin. Vui lòng liên hệ Admin để được cấp quyền bán sản phẩm."
        )

    service = MarketService(db)
    post = await service.create_post(current_user.id, data)
    return success_response(data=post, message="Đăng tin thành công")

@router.put("/{post_id}", response_model=ResponseModel[MarketPostResponse])
async def update_market_post(
    post_id: int,
    data: MarketPostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cập nhật tin đăng (Chỉ chủ bài đăng)"""
    service = MarketService(db)
    post = await service.update_post(post_id, current_user.id, data)
    return success_response(data=post, message="Cập nhật tin đăng thành công")

@router.patch("/{post_id}/status", response_model=ResponseModel[MarketPostResponse])
async def moderate_market_post(
    post_id: int,
    status: PostStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """Admin duyệt / từ chối tin đăng"""
    service = MarketService(db)
    post = await service.get_post(post_id)
    post.status = status
    updated_post = await service.repo.update_post(post)
    return success_response(data=updated_post, message=f"Đã chuyển trạng thái tin đăng thành {status.value}")

@router.delete("/{post_id}", response_model=ResponseModel[None])
async def delete_market_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Xóa tin đăng (Chủ bài đăng hoặc Admin)"""
    service = MarketService(db)
    is_admin = any(role.name == "admin" for role in current_user.roles) if hasattr(current_user, 'roles') else False
    await service.delete_post(post_id, current_user.id, is_admin)
    return success_response(data=None, message="Xóa tin đăng thành công")
