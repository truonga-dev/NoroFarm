from typing import List, Optional, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from app.models.admin import Banner, Announcement, SystemSetting, AuditLog
from app.models.user import User
from app.models.commodity import Commodity
from app.models.news import Article

class AdminRepository:
    """Repository quản lý Admin Dashboard"""
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Banner ---
    async def get_banners(self, only_active: bool = False) -> List[Banner]:
        query = select(Banner).order_by(Banner.display_order)
        if only_active:
            query = query.where(Banner.is_active == True)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_banner(self, banner_id: int) -> Optional[Banner]:
        query = select(Banner).where(Banner.id == banner_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_banner(self, banner: Banner) -> Banner:
        self.db.add(banner)
        await self.db.commit()
        await self.db.refresh(banner)
        return banner

    async def update_banner(self, banner: Banner) -> Banner:
        self.db.add(banner)
        await self.db.commit()
        await self.db.refresh(banner)
        return banner

    async def delete_banner(self, banner: Banner) -> None:
        await self.db.delete(banner)
        await self.db.commit()

    # --- Announcement ---
    async def get_announcements(self, only_active: bool = False) -> List[Announcement]:
        query = select(Announcement).order_by(desc(Announcement.created_at))
        if only_active:
            query = query.where(Announcement.is_active == True)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_announcement(self, announcement_id: int) -> Optional[Announcement]:
        query = select(Announcement).where(Announcement.id == announcement_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_announcement(self, announcement: Announcement) -> Announcement:
        self.db.add(announcement)
        await self.db.commit()
        await self.db.refresh(announcement)
        return announcement

    async def update_announcement(self, announcement: Announcement) -> Announcement:
        self.db.add(announcement)
        await self.db.commit()
        await self.db.refresh(announcement)
        return announcement

    async def delete_announcement(self, announcement: Announcement) -> None:
        await self.db.delete(announcement)
        await self.db.commit()

    # --- System Settings ---
    async def get_settings(self) -> List[SystemSetting]:
        query = select(SystemSetting)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_setting(self, key: str) -> Optional[SystemSetting]:
        query = select(SystemSetting).where(SystemSetting.key == key)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_setting(self, setting: SystemSetting) -> SystemSetting:
        self.db.add(setting)
        await self.db.commit()
        await self.db.refresh(setting)
        return setting

    async def update_setting(self, setting: SystemSetting) -> SystemSetting:
        self.db.add(setting)
        await self.db.commit()
        await self.db.refresh(setting)
        return setting

    # --- Audit Log ---
    async def log_action(self, log: AuditLog) -> AuditLog:
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)
        return log

    async def get_recent_logs(self, limit: int = 20) -> List[AuditLog]:
        query = select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_audit_logs_paginated(
        self, page: int, size: int, action: Optional[str], resource: Optional[str], user_id: Optional[int]
    ) -> Tuple[List[AuditLog], int]:
        conditions = []
        if action:
            conditions.append(AuditLog.action.ilike(f"%{action}%"))
        if resource:
            conditions.append(AuditLog.resource == resource)
        if user_id:
            conditions.append(AuditLog.user_id == user_id)

        base_query = select(AuditLog)
        if conditions:
            base_query = base_query.where(and_(*conditions))

        # Total count
        count_query = select(func.count()).select_from(base_query.subquery())
        count_result = await self.db.execute(count_query)
        total = count_result.scalar() or 0

        # Paginated items
        query = base_query.order_by(desc(AuditLog.created_at)).offset((page - 1) * size).limit(size)
        result = await self.db.execute(query)
        items = list(result.scalars().all())

        return items, total

    # --- Analytics ---
    async def get_total_users(self) -> int:
        result = await self.db.execute(select(func.count(User.id)))
        return result.scalar() or 0

    async def get_total_commodities(self) -> int:
        result = await self.db.execute(select(func.count(Commodity.id)))
        return result.scalar() or 0

    async def get_total_articles(self) -> int:
        result = await self.db.execute(select(func.count(Article.id)))
        return result.scalar() or 0
        
    async def get_active_announcements_count(self) -> int:
        result = await self.db.execute(select(func.count(Announcement.id)).where(Announcement.is_active == True))
        return result.scalar() or 0
