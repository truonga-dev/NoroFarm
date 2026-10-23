from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.commodity import CategoryResponse, CategoryCreate
from app.services.commodity import CommodityService
from app.common.response import ResponseModel, success_response
from app.dependencies.auth import RoleChecker
from app.models.user import User

router = APIRouter()

@router.get("", response_model=ResponseModel[List[CategoryResponse]])
async def get_categories(db: AsyncSession = Depends(get_db)):
    service = CommodityService(db)
    categories = await service.get_categories()
    return success_response(data=categories)

@router.post("", response_model=ResponseModel[CategoryResponse], status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "manager"]))
):
    service = CommodityService(db)
    category = await service.create_category(data)
    return success_response(data=category, message="Category created successfully")
