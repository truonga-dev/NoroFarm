from typing import List, Optional
from sqlalchemy import String, Boolean, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

user_role = Table(
    "user_role",
    Base.metadata,
    Column("user_id", ForeignKey("user.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", ForeignKey("role.id", ondelete="CASCADE"), primary_key=True),
)

role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("role_id", ForeignKey("role.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", ForeignKey("permission.id", ondelete="CASCADE"), primary_key=True),
)

user_watchlist = Table(
    "user_watchlist",
    Base.metadata,
    Column("user_id", ForeignKey("user.id", ondelete="CASCADE"), primary_key=True),
    Column("commodity_id", ForeignKey("commodity.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "user"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    profile: Mapped["Profile"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    roles: Mapped[List["Role"]] = relationship(secondary=user_role, back_populates="users", lazy="selectin")
    watchlist_commodities: Mapped[List["Commodity"]] = relationship(secondary=user_watchlist, lazy="selectin")

class Profile(Base):
    __tablename__ = "profile"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), unique=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    avatar_url: Mapped[Optional[str]] = mapped_column(String(1024))
    
    user: Mapped["User"] = relationship(back_populates="profile")

class Role(Base):
    __tablename__ = "role"

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255))
    
    users: Mapped[List["User"]] = relationship(secondary=user_role, back_populates="roles")
    permissions: Mapped[List["Permission"]] = relationship(secondary=role_permission, back_populates="roles", lazy="selectin")

class Permission(Base):
    __tablename__ = "permission"

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255))
    
    roles: Mapped[List["Role"]] = relationship(secondary=role_permission, back_populates="permissions")
