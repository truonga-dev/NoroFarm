from typing import List, Optional, TypeVar, Generic
from datetime import datetime
from pydantic import BaseModel, Field

T = TypeVar("T")

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)
    sort_by: Optional[str] = "created_at"
    sort_desc: bool = True

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int

# --- Tag ---
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    slug: str
    
    model_config = {"from_attributes": True}

# --- Category ---
class ArticleCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True

class ArticleCategoryCreate(ArticleCategoryBase):
    pass

class ArticleCategoryResponse(ArticleCategoryBase):
    id: int
    slug: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

# --- Article ---
class ArticleBase(BaseModel):
    title: str
    summary: Optional[str] = None
    content: str
    thumbnail_url: Optional[str] = None
    category_id: int
    is_published: bool = False
    
    # SEO
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class ArticleCreate(ArticleBase):
    tag_names: Optional[List[str]] = []

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    thumbnail_url: Optional[str] = None
    category_id: Optional[int] = None
    is_published: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    tag_names: Optional[List[str]] = None

class ArticleResponse(ArticleBase):
    id: int
    slug: str
    published_at: Optional[datetime] = None
    view_count: int
    created_at: datetime
    updated_at: datetime
    author_id: Optional[int] = None
    category: Optional[ArticleCategoryResponse] = None
    tags: List[TagResponse] = []

    model_config = {"from_attributes": True}
