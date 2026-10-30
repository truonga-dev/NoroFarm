from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.commodity import (
    CommodityResponse, CommodityCreate, CommodityUpdate,
    PriceResponse, PriceCreate, BulkPriceCreate, PaginationParams, PaginatedResponse,
    PriceHistoryPoint, TopMoverResponse, CommodityOverviewResponse
)
from app.services.commodity import CommodityService
from app.common.response import ResponseModel, success_response
from app.dependencies.auth import get_current_active_user, RoleChecker
from app.models.user import User

router = APIRouter()

@router.get("", response_model=ResponseModel[PaginatedResponse[CommodityResponse]])
async def get_commodities(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    sort_by: Optional[str] = None,
    sort_desc: bool = False,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = CommodityService(db)
    params = PaginationParams(page=page, size=size, sort_by=sort_by, sort_desc=sort_desc)
    result = await service.get_commodities(params, search, category_id, category)
    return success_response(data=result)

@router.get("/top-movers", response_model=ResponseModel[List[TopMoverResponse]])
async def get_top_movers(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """API lấy danh sách nông sản biến động giá mạnh nhất"""
    service = CommodityService(db)
    movers = await service.get_top_movers(limit)
    return success_response(data=movers)

@router.get("/overview", response_model=ResponseModel[List[CommodityOverviewResponse]])
async def get_commodity_overview(db: AsyncSession = Depends(get_db)):
    service = CommodityService(db)
    return success_response(data=await service.get_overview())

@router.get("/realtime", response_model=ResponseModel[List[TopMoverResponse]])
async def get_realtime_prices_2026(
    limit: int = Query(50, ge=1, le=100),
    sync: bool = Query(False, description="Kích hoạt đồng bộ trực tiếp trước khi trả về"),
    db: AsyncSession = Depends(get_db)
):
    """API lấy bảng giá thị trường thời gian thực 2026 cho toàn bộ nông sản"""
    if sync:
        from app.tasks.crawlers import run_all_crawlers
        await run_all_crawlers()
    service = CommodityService(db)
    movers = await service.get_top_movers(limit)
    return success_response(
        data=movers,
        message="Bảng giá thị trường nông sản thời gian thực 2026"
    )

@router.get("/{commodity_id}", response_model=ResponseModel[CommodityResponse])
async def get_commodity(commodity_id: int, db: AsyncSession = Depends(get_db)):
    service = CommodityService(db)
    commodity = await service.get_commodity(commodity_id)
    return success_response(data=commodity)

@router.post("", response_model=ResponseModel[CommodityResponse], status_code=status.HTTP_201_CREATED)
async def create_commodity(
    data: CommodityCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "manager"]))
):
    service = CommodityService(db)
    commodity = await service.create_commodity(data, current_user.id)
    return success_response(data=commodity, message="Commodity created successfully")

@router.put("/{commodity_id}", response_model=ResponseModel[CommodityResponse])
async def update_commodity(
    commodity_id: int,
    data: CommodityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "manager"]))
):
    service = CommodityService(db)
    commodity = await service.update_commodity(commodity_id, data, current_user.id)
    return success_response(data=commodity, message="Commodity updated successfully")

@router.delete("/{commodity_id}", response_model=ResponseModel[None])
async def delete_commodity(
    commodity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    service = CommodityService(db)
    await service.delete_commodity(commodity_id, current_user.id)
    return success_response(data=None, message="Commodity deleted successfully")

@router.get("/{commodity_id}/prices", response_model=ResponseModel[PaginatedResponse[PriceResponse]])
async def get_commodity_prices(
    commodity_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    service = CommodityService(db)
    params = PaginationParams(page=page, size=size)
    result = await service.get_prices(commodity_id, params)
    return success_response(data=result)

@router.post("/{commodity_id}/prices", response_model=ResponseModel[PriceResponse], status_code=status.HTTP_201_CREATED)
async def add_commodity_price(
    commodity_id: int,
    data: PriceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "manager"]))
):
    service = CommodityService(db)
    data.commodity_id = commodity_id
    price = await service.add_price(data, current_user.id)
    return success_response(data=price, message="Price added successfully")

@router.post("/bulk-prices", response_model=ResponseModel[dict], status_code=status.HTTP_201_CREATED)
async def bulk_add_prices(
    data: BulkPriceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin", "manager"]))
):
    service = CommodityService(db)
    count = await service.bulk_add_prices(data, current_user.id)
    return success_response(data={"inserted_count": count}, message=f"Đã cập nhật {count} mức giá thành công")



@router.get("/{commodity_id}/price-history", response_model=ResponseModel[List[PriceHistoryPoint]])
async def get_price_history(
    commodity_id: int,
    days: int = Query(30, ge=7, le=365),
    db: AsyncSession = Depends(get_db)
):
    """API lấy lịch sử giá theo ngày"""
    service = CommodityService(db)
    history = await service.get_price_history(commodity_id, days)
    return success_response(data=history)


@router.post("/crawl-live", response_model=ResponseModel[dict])
async def trigger_live_crawl():
    """Kích hoạt crawler lấy giá thị trường thực tế 2026 ngay lập tức từ nguồn bên ngoài"""
    from app.tasks.crawlers import run_all_crawlers
    from datetime import datetime, timezone
    await run_all_crawlers()
    return success_response(
        data={
            "status": "completed",
            "synced_at": datetime.now(timezone.utc).isoformat()
        },
        message="Đã đồng bộ thành công giá thị trường thời gian thực 2026."
    )
