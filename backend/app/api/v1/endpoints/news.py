from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.news import (
    ArticleCategoryResponse, ArticleCategoryCreate,
    ArticleResponse, ArticleCreate, ArticleUpdate,
    PaginatedResponse, PaginationParams
)
from app.services.news import NewsService
from app.common.response import ResponseModel, success_response
from app.dependencies.auth import get_current_active_user, RoleChecker
from app.models.user import User

router = APIRouter()

# --- Categories ---
@router.get("/categories", response_model=ResponseModel[List[ArticleCategoryResponse]])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """API lấy danh sách chuyên mục tin tức"""
    service = NewsService(db)
    categories = await service.get_categories()
    return success_response(data=categories)

@router.post("/categories", response_model=ResponseModel[ArticleCategoryResponse], status_code=status.HTTP_201_CREATED)
async def create_category(
    data: ArticleCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "editor"]))
):
    """API tạo chuyên mục tin tức (Admin/Editor)"""
    service = NewsService(db)
    category = await service.create_category(data)
    return success_response(data=category, message="Tạo chuyên mục thành công")

# --- Articles ---
@router.get("", response_model=ResponseModel[PaginatedResponse[ArticleResponse]])
async def get_articles(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    sort_by: Optional[str] = "published_at",
    sort_desc: bool = True,
    search: Optional[str] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """API lấy danh sách bài viết (có phân trang, tìm kiếm, lọc)"""
    service = NewsService(db)
    params = PaginationParams(page=page, size=size, sort_by=sort_by, sort_desc=sort_desc)
    result = await service.get_articles(params, search, category, tag, is_published=True)
    return success_response(data=result)

@router.get("/{slug}", response_model=ResponseModel[ArticleResponse])
async def get_article_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """API lấy chi tiết bài viết theo Slug"""
    service = NewsService(db)
    article = await service.get_article_by_slug(slug)
    return success_response(data=article)

@router.post("", response_model=ResponseModel[ArticleResponse], status_code=status.HTTP_201_CREATED)
async def create_article(
    data: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "editor", "writer"]))
):
    """API tạo bài viết mới"""
    service = NewsService(db)
    article = await service.create_article(data, current_user.id)
    return success_response(data=article, message="Tạo bài viết thành công")

@router.put("/{article_id}", response_model=ResponseModel[ArticleResponse])
async def update_article(
    article_id: int,
    data: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "editor"]))
):
    """API cập nhật bài viết"""
    service = NewsService(db)
    article = await service.update_article(article_id, data)
    return success_response(data=article, message="Cập nhật bài viết thành công")

@router.delete("/{article_id}", response_model=ResponseModel[dict])
async def delete_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "editor"]))
):
    """API xóa bài viết"""
    service = NewsService(db)
    await service.delete_article(article_id)
    return success_response(data={"id": article_id}, message="Xóa bài viết thành công")
