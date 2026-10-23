from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc
from sqlalchemy.orm import selectinload
from app.models.market import MarketPost, PostType, PostStatus
from app.models.commodity import Commodity
from app.models.user import User

class MarketRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_posts(
        self,
        page: int = 1,
        size: int = 20,
        post_type: Optional[PostType] = None,
        commodity_id: Optional[int] = None,
        search: Optional[str] = None,
        status: Optional[PostStatus] = None,
        user_id: Optional[int] = None
    ) -> Tuple[List[MarketPost], int]:
        query = select(MarketPost).filter(MarketPost.is_active == True)
        
        if post_type:
            query = query.filter(MarketPost.post_type == post_type)
        if commodity_id:
            query = query.filter(MarketPost.commodity_id == commodity_id)
        if search:
            query = query.filter(MarketPost.title.ilike(f"%{search}%"))
        if status:
            query = query.filter(MarketPost.status == status)
        if user_id:
            query = query.filter(MarketPost.user_id == user_id)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # Pagination and order
        query = query.order_by(desc(MarketPost.created_at))
        query = query.offset((page - 1) * size).limit(size)
        
        # Load relations
        query = query.options(
            selectinload(MarketPost.user).selectinload(User.profile),
            selectinload(MarketPost.user).selectinload(User.roles),
            selectinload(MarketPost.commodity).selectinload(Commodity.category),
            selectinload(MarketPost.commodity).selectinload(Commodity.prices),
        )

        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return items, total

    async def get_post_by_id(self, post_id: int) -> Optional[MarketPost]:
        query = select(MarketPost).filter(MarketPost.id == post_id)
        query = query.options(
            selectinload(MarketPost.user).selectinload(User.profile),
            selectinload(MarketPost.user).selectinload(User.roles),
            selectinload(MarketPost.commodity).selectinload(Commodity.category),
            selectinload(MarketPost.commodity).selectinload(Commodity.prices),
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_post(self, post: MarketPost) -> MarketPost:
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        return await self.get_post_by_id(post.id)

    async def update_post(self, post: MarketPost) -> MarketPost:
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        return await self.get_post_by_id(post.id)

    async def delete_post(self, post: MarketPost) -> None:
        await self.db.delete(post)
        await self.db.commit()
