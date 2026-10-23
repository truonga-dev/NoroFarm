import math
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.market import MarketPost, PostType, PostStatus
from app.schemas.market import MarketPostCreate, MarketPostUpdate, MarketPostListResponse
from app.repositories.market import MarketRepository

class MarketService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = MarketRepository(db)

    async def get_posts(
        self,
        page: int = 1,
        size: int = 20,
        post_type: Optional[PostType] = None,
        commodity_id: Optional[int] = None,
        search: Optional[str] = None,
        status: Optional[PostStatus] = None,
        user_id: Optional[int] = None
    ) -> MarketPostListResponse:
        items, total = await self.repo.get_posts(page, size, post_type, commodity_id, search, status, user_id)
        pages = math.ceil(total / size) if total > 0 else 0
        return MarketPostListResponse(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=pages
        )

    async def get_post(self, post_id: int) -> MarketPost:
        post = await self.repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Không tìm thấy tin đăng")
        return post

    async def create_post(self, user_id: int, data: MarketPostCreate) -> MarketPost:
        post = MarketPost(**data.model_dump(), user_id=user_id)
        return await self.repo.create_post(post)

    async def update_post(self, post_id: int, user_id: int, data: MarketPostUpdate) -> MarketPost:
        post = await self.get_post(post_id)
        
        # Only owner or admin can update
        # We assume checking happens in endpoint or here
        if post.user_id != user_id:
            raise HTTPException(status_code=403, detail="Không có quyền chỉnh sửa tin đăng này")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(post, key, value)
            
        return await self.repo.update_post(post)

    async def delete_post(self, post_id: int, user_id: int, is_admin: bool = False) -> None:
        post = await self.get_post(post_id)
        
        if post.user_id != user_id and not is_admin:
            raise HTTPException(status_code=403, detail="Không có quyền xóa tin đăng này")

        await self.repo.delete_post(post)
