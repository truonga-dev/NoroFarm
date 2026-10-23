from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.user import User, Role

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> Optional[User]:
        query = select(User).options(selectinload(User.profile), selectinload(User.roles)).where(User.id == user_id)
        result = await self.db.execute(query)
        return result.unique().scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        query = select(User).options(selectinload(User.profile), selectinload(User.roles)).where(User.email == email)
        result = await self.db.execute(query)
        return result.unique().scalars().first()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
