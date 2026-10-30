import math
import re
from unicodedata import normalize
from typing import List, Optional, Tuple, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from datetime import datetime, timezone
from app.models.news import ArticleCategory, Tag, Article
from app.schemas.news import (
    ArticleCreate, ArticleUpdate, ArticleCategoryCreate,
    PaginationParams, PaginatedResponse
)
from app.repositories.news import NewsRepository

class NewsService:
    """Service xử lý nghiệp vụ Tin tức"""
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = NewsRepository(db)

    def _generate_slug(self, text: str) -> str:
        """Tạo slug từ chuỗi (ví dụ: 'Xin Chào' -> 'xin-chao')"""
        clean_text = normalize("NFD", text).encode("ascii", "ignore").decode("utf-8")
        clean_text = clean_text.lower()
        clean_text = re.sub(r'[^a-z0-9\s-]', '', clean_text)
        slug = re.sub(r'[\s-]+', '-', clean_text).strip('-')
        if not slug:
            slug = f"bai-viet-{int(datetime.now().timestamp())}"
        return slug

    def _create_paginated_response(self, items: List[Any], total: int, params: PaginationParams) -> PaginatedResponse:
        pages = math.ceil(total / params.size) if total > 0 else 0
        return PaginatedResponse(
            items=items,
            total=total,
            page=params.page,
            size=params.size,
            pages=pages
        )

    # --- Category ---
    async def get_categories(self) -> List[ArticleCategory]:
        return await self.repo.get_categories()

    async def create_category(self, data: ArticleCategoryCreate) -> ArticleCategory:
        slug = self._generate_slug(data.name)
        if await self.repo.get_category_by_slug(slug):
            slug = f"{slug}-{int(datetime.now().timestamp())}"
            
        category = ArticleCategory(**data.model_dump(), slug=slug)
        return await self.repo.create_category(category)

    # --- Tags ---
    async def _process_tags(self, tag_names: List[str]) -> List[Tag]:
        if not tag_names:
            return []
            
        existing_tags = await self.repo.get_tags_by_names(tag_names)
        existing_tag_names = {t.name for t in existing_tags}
        
        new_tags = []
        for name in tag_names:
            if name not in existing_tag_names:
                slug = self._generate_slug(name)
                new_tag = await self.repo.create_tag(Tag(name=name, slug=slug))
                new_tags.append(new_tag)
                
        return existing_tags + new_tags

    # --- Article ---
    async def get_articles(
        self, 
        params: PaginationParams, 
        search: Optional[str] = None, 
        category_slug: Optional[str] = None,
        tag_slug: Optional[str] = None,
        is_published: Optional[bool] = True
    ) -> PaginatedResponse[Any]:
        items, total = await self.repo.get_articles(params, search, category_slug, tag_slug, is_published)
        return self._create_paginated_response(items, total, params)

    async def get_article_by_slug(self, slug: str) -> Article:
        article = await self.repo.get_article_by_slug(slug)
        if not article or not article.is_published:
            raise HTTPException(status_code=404, detail="Bài viết không tồn tại")
        
        await self.repo.increment_view(article)
        return article

    async def get_article_by_id(self, article_id: int) -> Article:
        article = await self.repo.get_article_by_id(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Bài viết không tồn tại")
        return article

    async def create_article(self, data: ArticleCreate, author_id: int) -> Article:
        # Check and safely resolve category
        category = None
        if data.category_id:
            category = await self.repo.get_category_by_id(data.category_id)
        if not category:
            category = await self.repo.get_category_by_slug("chung")
        if not category:
            existing_cats = await self.repo.get_categories()
            if existing_cats:
                category = existing_cats[0]
            else:
                fallback = ArticleCategory(name="Chung", slug="chung", description="Chuyên mục chung", is_active=True)
                category = await self.repo.create_category(fallback)
        data.category_id = category.id

        slug = self._generate_slug(data.title)
        if await self.repo.get_article_by_slug(slug):
            slug = f"{slug}-{int(datetime.now().timestamp())}"
            
        article_data = data.model_dump(exclude={"tag_names"})
        if "thumbnail_url" in article_data and (not article_data["thumbnail_url"] or not article_data["thumbnail_url"].strip()):
            article_data["thumbnail_url"] = None

        article = Article(**article_data, slug=slug, author_id=author_id)
        
        if data.is_published:
            article.published_at = datetime.now(timezone.utc)
            
        if data.tag_names:
            article.tags = await self._process_tags(data.tag_names)
            
        return await self.repo.create_article(article)

    async def update_article(self, article_id: int, data: ArticleUpdate) -> Article:
        article = await self.repo.get_article_by_id(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Bài viết không tồn tại")
            
        update_data = data.model_dump(exclude_unset=True, exclude={"tag_names"})
        
        if "title" in update_data and update_data["title"] and update_data["title"] != article.title:
            slug = self._generate_slug(update_data["title"])
            if await self.repo.get_article_by_slug(slug):
                slug = f"{slug}-{int(datetime.now().timestamp())}"
            article.slug = slug

        if "thumbnail_url" in update_data and (not update_data["thumbnail_url"] or (isinstance(update_data["thumbnail_url"], str) and not update_data["thumbnail_url"].strip())):
            update_data["thumbnail_url"] = None
            
        for key, value in update_data.items():
            setattr(article, key, value)
            
        if "is_published" in update_data:
            if update_data["is_published"] and not article.published_at:
                article.published_at = datetime.now(timezone.utc)
                
        if data.tag_names is not None:
            article.tags = await self._process_tags(data.tag_names)
            
        return await self.repo.update_article(article)

    async def delete_article(self, article_id: int) -> None:
        article = await self.repo.get_article_by_id(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Bài viết không tồn tại")
        await self.repo.delete_article(article)
