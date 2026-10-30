from typing import List, Optional
from fastapi import APIRouter, Depends, status, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.admin import (
    BannerResponse, BannerCreate, BannerUpdate,
    AnnouncementResponse, AnnouncementCreate, AnnouncementUpdate,
    SystemSettingResponse, SystemSettingUpdate,
    DashboardAnalyticsResponse, AuditLogResponse, AuditLogListResponse,
    UserRoleUpdate
)
from app.services.admin import AdminService
from app.common.response import ResponseModel, success_response
from app.dependencies.auth import RoleChecker
from app.models.user import User, Role
from app.schemas.user import UserResponse
from app.schemas.market import MarketPostListResponse
from app.services.market import MarketService
from app.models.market import PostStatus
from app.schemas.shop import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse, OrderResponse, OrderListResponse
from app.services.shop import ShopService
from app.models.shop import OrderStatus
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException

router = APIRouter()

# --- Dashboard & Analytics ---
@router.get("/analytics", response_model=ResponseModel[DashboardAnalyticsResponse])
async def get_dashboard_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API lấy thống kê tổng quan (Dashboard Analytics)"""
    service = AdminService(db)
    analytics = await service.get_dashboard_analytics()
    return success_response(data=analytics)

# --- Banners ---
@router.get("/banners", response_model=ResponseModel[List[BannerResponse]])
async def get_banners(
    only_active: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """API lấy danh sách banner (Public hoặc Admin)"""
    service = AdminService(db)
    banners = await service.get_banners(only_active)
    return success_response(data=banners)

@router.post("/banners", response_model=ResponseModel[BannerResponse], status_code=status.HTTP_201_CREATED)
async def create_banner(
    request: Request,
    data: BannerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API tạo mới banner (Admin)"""
    service = AdminService(db)
    banner = await service.create_banner(data)
    await service.log_admin_action(request, current_user.id, "create_banner", "banner", str(banner.id))
    return success_response(data=banner, message="Tạo banner thành công")

@router.put("/banners/{banner_id}", response_model=ResponseModel[BannerResponse])
async def update_banner(
    request: Request,
    banner_id: int,
    data: BannerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API cập nhật banner (Admin)"""
    service = AdminService(db)
    banner = await service.update_banner(banner_id, data)
    await service.log_admin_action(request, current_user.id, "update_banner", "banner", str(banner.id))
    return success_response(data=banner, message="Cập nhật banner thành công")

@router.delete("/banners/{banner_id}", response_model=ResponseModel[None])
async def delete_banner(
    request: Request,
    banner_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API xóa banner (Admin)"""
    service = AdminService(db)
    await service.delete_banner(banner_id)
    await service.log_admin_action(request, current_user.id, "delete_banner", "banner", str(banner_id))
    return success_response(data=None, message="Xóa banner thành công")

# --- Announcements ---
@router.get("/announcements", response_model=ResponseModel[List[AnnouncementResponse]])
async def get_announcements(
    only_active: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """API lấy danh sách thông báo"""
    service = AdminService(db)
    announcements = await service.get_announcements(only_active)
    return success_response(data=announcements)

@router.post("/announcements", response_model=ResponseModel[AnnouncementResponse], status_code=status.HTTP_201_CREATED)
async def create_announcement(
    request: Request,
    data: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API tạo thông báo (Admin)"""
    service = AdminService(db)
    announcement = await service.create_announcement(data)
    await service.log_admin_action(request, current_user.id, "create_announcement", "announcement", str(announcement.id))
    return success_response(data=announcement, message="Tạo thông báo thành công")

# --- Users Management ---
@router.get("/users", response_model=ResponseModel[List[UserResponse]])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API lấy danh sách toàn bộ người dùng (Admin)"""
    result = await db.execute(
        select(User).options(selectinload(User.profile), selectinload(User.roles))
    )
    users = result.scalars().all()
    return success_response(data=users)

@router.patch("/users/{user_id}/status", response_model=ResponseModel[UserResponse])
async def toggle_user_status(
    user_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API Khóa/Mở khóa tài khoản (Admin)"""
    result = await db.execute(select(User).options(selectinload(User.profile), selectinload(User.roles)).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    if user.email == "admin@norofarm.com":
        raise HTTPException(status_code=403, detail="Không thể khóa tài khoản Admin gốc")

    user.is_active = not user.is_active
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    service = AdminService(db)
    action = "ban_user" if not user.is_active else "unban_user"
    await service.log_admin_action(request, current_user.id, action, "user", str(user.id))
    
    return success_response(data=user, message="Thay đổi trạng thái thành công")

@router.patch("/users/{user_id}/role", response_model=ResponseModel[UserResponse])
async def change_user_role(
    user_id: int,
    data: UserRoleUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API Thay đổi quyền (Admin) - Cấp quyền seller, admin... cho user"""
    result = await db.execute(select(User).options(selectinload(User.profile), selectinload(User.roles)).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    if user.email == "admin@norofarm.com":
        raise HTTPException(status_code=403, detail="Không thể thay đổi quyền của Admin gốc")

    # Lấy các object role từ db tương ứng với danh sách role truyền vào
    role_result = await db.execute(select(Role).filter(Role.name.in_(data.roles)))
    roles_to_assign = role_result.scalars().all()

    # Cập nhật quyền
    user.roles = list(roles_to_assign)
    db.add(user)
    await db.commit()
    await db.refresh(user)

    service = AdminService(db)
    await service.log_admin_action(request, current_user.id, "update_user_roles", "user", str(user.id), details={"new_roles": data.roles})
    
    return success_response(data=user, message="Cập nhật quyền thành công")

# --- System Settings ---
@router.get("/settings", response_model=ResponseModel[List[SystemSettingResponse]])
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API lấy danh sách cấu hình hệ thống (Admin)"""
    service = AdminService(db)
    settings = await service.get_settings()
    return success_response(data=settings)

@router.put("/settings/{key}", response_model=ResponseModel[SystemSettingResponse])
async def update_setting(
    request: Request,
    key: str,
    data: SystemSettingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API cập nhật cấu hình hệ thống (Admin)"""
    service = AdminService(db)
    setting = await service.update_setting(key, data)
    await service.log_admin_action(request, current_user.id, "update_setting", "setting", key)
    return success_response(data=setting, message="Cập nhật cấu hình thành công")

# --- Audit Logs ---
@router.get("/audit-logs", response_model=ResponseModel[AuditLogListResponse])
async def get_audit_logs(
    page: int = 1,
    size: int = 20,
    action: Optional[str] = None,
    resource: Optional[str] = None,
    user_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API lấy danh sách Audit Logs (Admin)"""
    service = AdminService(db)
    result = await service.get_audit_logs(page=page, size=size, action=action, resource=resource, user_id=user_id)
    return success_response(data=result)

# --- Market Moderation ---
@router.get("/market-posts", response_model=ResponseModel[MarketPostListResponse])
async def admin_get_market_posts(
    page: int = 1,
    size: int = 20,
    status: Optional[PostStatus] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API lấy tất cả tin đăng (cả chờ duyệt, từ chối, v.v...) cho Admin"""
    service = MarketService(db)
    result = await service.get_posts(page=page, size=size, search=search, status=status)
    return success_response(data=result)

# --- Shop B2C Management ---
@router.get("/products", response_model=ResponseModel[ProductListResponse])
async def admin_get_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    stock_status: Optional[str] = Query(None, pattern="^(in|low|out)$"),
    sort: str = Query("newest", pattern="^(newest|oldest|name_asc|name_desc|price_asc|price_desc|stock_asc|stock_desc)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API danh sách sản phẩm cho Admin (gồm cả sản phẩm ngừng bán) với bộ lọc, sắp xếp và phân trang"""
    service = ShopService(db)
    result = await service.admin_get_products(
        page=page,
        size=size,
        category_id=category_id,
        search=search,
        is_active=is_active,
        stock_status=stock_status,
        sort=sort,
    )
    return success_response(data=result)

@router.post("/products", response_model=ResponseModel[ProductResponse])
async def admin_create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API thêm sản phẩm B2C mới (Admin)"""
    service = ShopService(db)
    result = await service.create_product(data)
    return success_response(data=result, message="Thêm sản phẩm thành công")

@router.put("/products/{id}", response_model=ResponseModel[ProductResponse])
async def admin_update_product(
    id: int,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API cập nhật sản phẩm B2C (Admin)"""
    service = ShopService(db)
    result = await service.update_product(id, data)
    return success_response(data=result, message="Cập nhật sản phẩm thành công")

@router.get("/orders", response_model=ResponseModel[OrderListResponse])
async def admin_get_orders(
    page: int = 1,
    size: int = 20,
    status: Optional[OrderStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API quản lý đơn hàng B2C (Admin)"""
    service = ShopService(db)
    result = await service.get_all_orders(page=page, size=size, status=status)
    return success_response(data=result)

@router.patch("/orders/{id}/status", response_model=ResponseModel[OrderResponse])
async def admin_update_order_status(
    id: int,
    status: OrderStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """API cập nhật trạng thái đơn hàng (Admin)"""
    service = ShopService(db)
    result = await service.update_order_status(id, status)
    return success_response(data=result, message="Cập nhật trạng thái đơn hàng thành công")
