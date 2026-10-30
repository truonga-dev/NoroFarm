from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.common.response import ResponseModel, success_response, error_response
from app.database.database import get_db, engine
from app.core.logger import logger
from app.models.base import Base
# Import all models to ensure they are registered with Base.metadata
import app.models.user
import app.models.admin
import app.models.weather
import app.models.commodity
import app.models.news
import app.models.contact
from app.models.weather import Location

router = APIRouter()

@router.get("/health", response_model=ResponseModel[dict])
async def health_check() -> ResponseModel[dict]:
    return success_response(data={"status": "healthy"}, message="System is healthy")

@router.get("/status", response_model=ResponseModel[dict])
async def system_status(db: AsyncSession = Depends(get_db)) -> ResponseModel[dict]:
    try:
        # Check database connection
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        db_status = "disconnected"
        
    return success_response(
        data={
            "app": "running",
            "database": db_status
        },
        message="System status retrieved successfully"
    )

from app.core.config import settings
from fastapi import HTTPException, status

@router.get("/init-db", response_model=ResponseModel[dict])
async def init_db(db: AsyncSession = Depends(get_db)) -> ResponseModel[dict]:
    if settings.ENVIRONMENT == "production":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không được phép chạy khởi tạo database trực tiếp trên môi trường production!")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            
        # Seed initial locations if needed
        async with db.begin():
            # Check if HN exists
            result = await db.execute(text("SELECT id FROM location WHERE code = 'HN'"))
            if not result.scalar():
                await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('HN', 'Hà Nội', 21.0285, 105.8542)"))
                await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('HCM', 'Hồ Chí Minh', 10.8231, 106.6297)"))
                await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('DL', 'Đắk Lắk', 12.6667, 108.0383)"))
                await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('GL', 'Gia Lai', 13.9833, 108.0000)"))
                
        return success_response(data={"status": "success"}, message="Database initialized successfully")
    except Exception as e:
        return error_response(message=f"Database initialization failed: {e}")

@router.get("/reset-db", response_model=ResponseModel[dict])
async def reset_db(db: AsyncSession = Depends(get_db)) -> ResponseModel[dict]:
    if settings.ENVIRONMENT == "production":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tuyệt đối không được phép xóa toàn bộ database trên production!")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
            
        async with db.begin():
            await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('HN', 'Hà Nội', 21.0285, 105.8542)"))
            await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('HCM', 'Hồ Chí Minh', 10.8231, 106.6297)"))
            await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('DL', 'Đắk Lắk', 12.6667, 108.0383)"))
            await db.execute(text("INSERT INTO location (code, name, latitude, longitude) VALUES ('GL', 'Gia Lai', 13.9833, 108.0000)"))
            
        return success_response(data={"status": "success"}, message="Database reset and initialized successfully")
    except Exception as e:
        return error_response(message=f"Database reset failed: {e}", data={})




