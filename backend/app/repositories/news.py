from typing import Any, List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc
from sqlalchemy.orm import joinedload, selectinload
from app.models.news import ArticleCategory, Tag, Article
from app.schemas.news import PaginationParams

class NewsRepository:
    """Repository quản lý Tin tức"""
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _paginate(self, query, params: PaginationParams) -> Tuple[List[Any], int]:
        total = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total_count = total.scalar() or 0

        query = query.offset((params.page - 1) * params.size).limit(params.size)
        result = await self.db.execute(query)
        return list(result.unique().scalars().all()), total_count

    # --- Category ---
    async def get_categories(self) -> List[ArticleCategory]:
        query = select(ArticleCategory).where(ArticleCategory.is_active == True)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_category_by_slug(self, slug: str) -> Optional[ArticleCategory]:
        query = select(ArticleCategory).where(ArticleCategory.slug == slug)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_category_by_id(self, category_id: int) -> Optional[ArticleCategory]:
        query = select(ArticleCategory).where(ArticleCategory.id == category_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_category(self, category: ArticleCategory) -> ArticleCategory:
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    # --- Tag ---
    async def get_tags_by_names(self, names: List[str]) -> List[Tag]:
        query = select(Tag).where(Tag.name.in_(names))
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_tag(self, tag: Tag) -> Tag:
        self.db.add(tag)
        await self.db.commit()
        await self.db.refresh(tag)
        return tag

    # --- Article ---
    async def get_article_by_slug(self, slug: str) -> Optional[Article]:
        query = select(Article).options(joinedload(Article.category), selectinload(Article.tags)).where(Article.slug == slug)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_article_by_id(self, article_id: int) -> Optional[Article]:
        query = select(Article).options(joinedload(Article.category), selectinload(Article.tags)).where(Article.id == article_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_articles(
        self, 
        params: PaginationParams, 
        search: Optional[str] = None, 
        category_slug: Optional[str] = None,
        tag_slug: Optional[str] = None,
        is_published: Optional[bool] = True
    ) -> Tuple[List[Article], int]:
        
        query = select(Article).options(joinedload(Article.category), selectinload(Article.tags))
        
        if is_published is not None:
            query = query.where(Article.is_published == is_published)
            
        if search:
            query = query.where((Article.title.ilike(f"%{search}%")) | (Article.summary.ilike(f"%{search}%")))
            
        if category_slug:
            query = query.join(Article.category).where(ArticleCategory.slug == category_slug)
            
        if tag_slug:
            query = query.join(Article.tags).where(Tag.slug == tag_slug)
            
        if params.sort_by and hasattr(Article, params.sort_by):
            order_col = getattr(Article, params.sort_by)
            query = query.order_by(desc(order_col) if params.sort_desc else asc(order_col))
            
        return await self._paginate(query, params)

    async def create_article(self, article: Article) -> Article:
        self.db.add(article)
        await self.db.commit()
        loaded = await self.get_article_by_id(article.id)
        return loaded or article

    async def update_article(self, article: Article) -> Article:
        self.db.add(article)
        await self.db.commit()
        loaded = await self.get_article_by_id(article.id)
        return loaded or article
        
    async def increment_view(self, article: Article) -> None:
        article.view_count += 1
        self.db.add(article)
        await self.db.commit()

    async def delete_article(self, article: Article) -> None:
        await self.db.delete(article)
        await self.db.commit()
