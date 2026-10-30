from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, Table, Column, Text, Boolean, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

# Bảng trung gian nhiều-nhiều giữa Article và Tag
article_tag = Table(
    "article_tag",
    Base.metadata,
    Column("article_id", ForeignKey("article.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tag.id", ondelete="CASCADE"), primary_key=True),
)

class ArticleCategory(Base):
    """
    Danh mục tin tức/bài viết
    """
    __tablename__ = "article_category"

    name: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    articles: Mapped[List["Article"]] = relationship(back_populates="category")

class Tag(Base):
    """
    Thẻ phân loại bài viết
    """
    __tablename__ = "tag"

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)

    articles: Mapped[List["Article"]] = relationship(secondary=article_tag, back_populates="tags")

class Article(Base):
    """
    Bài viết/Tin tức
    """
    __tablename__ = "article"
    __table_args__ = (
        Index("ix_article_article_category_id", "category_id"),
        Index("ix_article_published_date", "is_published", "published_at"),
    )

    title: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    summary: Mapped[Optional[str]] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(Text)
    
    # SEO
    meta_title: Mapped[Optional[str]] = mapped_column(String(255))
    meta_description: Mapped[Optional[str]] = mapped_column(String(500))
    meta_keywords: Mapped[Optional[str]] = mapped_column(String(255))

    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), index=True)
    
    view_count: Mapped[int] = mapped_column(default=0)

    category_id: Mapped[int] = mapped_column(ForeignKey("article_category.id", ondelete="RESTRICT"), index=True)
    author_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), index=True)

    category: Mapped["ArticleCategory"] = relationship(back_populates="articles", lazy="selectin")
    tags: Mapped[List["Tag"]] = relationship(secondary=article_tag, back_populates="articles", lazy="selectin")
