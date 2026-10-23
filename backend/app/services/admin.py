from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request, HTTPException
from app.models.admin import Banner, Announcement, SystemSetting, AuditLog
from app.schemas.admin import (
    BannerCreate, BannerUpdate,
    AnnouncementCreate, AnnouncementUpdate,
    SystemSettingCreate, SystemSettingUpdate,
    DashboardAnalyticsResponse, AuditLogListResponse
)
from app.repositories.admin import AdminRepository

class AdminService:
    """Service xử lý nghiệp vụ Admin Dashboard"""
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AdminRepository(db)

    # --- Analytics ---
    async def get_dashboard_analytics(self) -> DashboardAnalyticsResponse:
        total_users = await self.repo.get_total_users()
        total_commodities = await self.repo.get_total_commodities()
        total_articles = await self.repo.get_total_articles()
        active_announcements = await self.repo.get_active_announcements_count()
        recent_activities = await self.repo.get_recent_logs(limit=10)

        # Mock traffic data for now since we don't have a tracking system
        traffic_data = [
            {"name": "T2", "views": 400, "users": 240},
            {"name": "T3", "views": 300, "users": 139},
            {"name": "T4", "views": 520, "users": 480},
            {"name": "T5", "views": 450, "users": 380},
            {"name": "T6", "views": 600, "users": 430},
            {"name": "T7", "views": 800, "users": 510},
            {"name": "CN", "views": 950, "users": 600},
        ]

        return DashboardAnalyticsResponse(
            total_users=total_users,
            total_commodities=total_commodities,
            total_articles=total_articles,
            active_announcements=active_announcements,
            recent_activities=recent_activities,
            traffic_data=traffic_data
        )

    # --- Audit Log ---
    async def log_admin_action(self, request: Request, user_id: int, action: str, resource: str, resource_id: Optional[str] = None, details: Optional[dict] = None) -> AuditLog:
        ip_address = request.client.host if request and request.client else None
        log = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address
        )
        return await self.repo.log_action(log)

    async def get_audit_logs(
        self, page: int = 1, size: int = 20,
        action: Optional[str] = None, resource: Optional[str] = None, user_id: Optional[int] = None
    ) -> AuditLogListResponse:
        import math
        items, total = await self.repo.get_audit_logs_paginated(page, size, action, resource, user_id)
        pages = math.ceil(total / size) if total > 0 else 0
        return AuditLogListResponse(items=items, total=total, page=page, size=size, pages=pages)

    # --- Banner ---
    async def get_banners(self, only_active: bool = False) -> List[Banner]:
        return await self.repo.get_banners(only_active)

    async def create_banner(self, data: BannerCreate) -> Banner:
        banner = Banner(**data.model_dump())
        return await self.repo.create_banner(banner)

    async def update_banner(self, banner_id: int, data: BannerUpdate) -> Banner:
        banner = await self.repo.get_banner(banner_id)
        if not banner:
            raise HTTPException(status_code=404, detail="Banner không tồn tại")
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(banner, key, value)
            
        return await self.repo.update_banner(banner)

    async def delete_banner(self, banner_id: int) -> None:
        banner = await self.repo.get_banner(banner_id)
        if not banner:
            raise HTTPException(status_code=404, detail="Banner không tồn tại")
        await self.repo.delete_banner(banner)

    # --- Announcement ---
    async def get_announcements(self, only_active: bool = False) -> List[Announcement]:
        return await self.repo.get_announcements(only_active)

    async def create_announcement(self, data: AnnouncementCreate) -> Announcement:
        announcement = Announcement(**data.model_dump())
        return await self.repo.create_announcement(announcement)

    async def update_announcement(self, announcement_id: int, data: AnnouncementUpdate) -> Announcement:
        announcement = await self.repo.get_announcement(announcement_id)
        if not announcement:
            raise HTTPException(status_code=404, detail="Thông báo không tồn tại")
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(announcement, key, value)
            
        return await self.repo.update_announcement(announcement)

    async def delete_announcement(self, announcement_id: int) -> None:
        announcement = await self.repo.get_announcement(announcement_id)
        if not announcement:
            raise HTTPException(status_code=404, detail="Thông báo không tồn tại")
        await self.repo.delete_announcement(announcement)

    # --- Settings ---
    async def get_settings(self) -> List[SystemSetting]:
        return await self.repo.get_settings()

    async def update_setting(self, key: str, data: SystemSettingUpdate) -> SystemSetting:
        setting = await self.repo.get_setting(key)
        if not setting:
            raise HTTPException(status_code=404, detail="Cấu hình không tồn tại")
            
        setting.value = data.value
        return await self.repo.update_setting(setting)
