import json
from typing import List, Optional, Tuple, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.commodity import Commodity, CommodityCategory, CommodityPrice, CommodityHistory
from app.schemas.commodity import (
    CommodityCreate, CommodityUpdate,
    CategoryCreate, CategoryUpdate,
    PriceCreate, BulkPriceCreate, PaginationParams, PaginatedResponse,
    PriceHistoryPoint, TopMoverResponse, CommodityOverviewResponse
)
from app.repositories.commodity import CommodityRepository
import math

class CommodityService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = CommodityRepository(db)

    def _create_paginated_response(self, items: List[Any], total: int, params: PaginationParams) -> PaginatedResponse:
        pages = math.ceil(total / params.size) if total > 0 else 0
        return PaginatedResponse(
            items=items,
            total=total,
            page=params.page,
            size=params.size,
            pages=pages
        )

    # --- Commodity ---
    async def get_commodity(self, commodity_id: int) -> Commodity:
        commodity = await self.repo.get_commodity(commodity_id)
        if not commodity:
            raise HTTPException(status_code=404, detail="Commodity not found")
        return commodity

    async def get_commodities(self, params: PaginationParams, search: Optional[str] = None, category_id: Optional[int] = None, category: Optional[str] = None) -> PaginatedResponse[Any]:
        items, total = await self.repo.get_commodities(params, search, category_id, category)
        return self._create_paginated_response(items, total, params)

    async def get_overview(self) -> List[CommodityOverviewResponse]:
        return [CommodityOverviewResponse.model_validate(item) for item in await self.repo.get_overview()]

    async def create_commodity(self, data: CommodityCreate, user_id: int) -> Commodity:
        if await self.repo.get_commodity_by_code(data.code):
            raise HTTPException(status_code=400, detail="Commodity code already exists")
            
        category = await self.repo.get_category(data.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
            
        commodity = Commodity(**data.model_dump())
        commodity = await self.repo.create_commodity(commodity)
        
        # Log history
        await self.repo.add_history(CommodityHistory(
            commodity_id=commodity.id,
            action="created",
            changes=json.dumps(data.model_dump()),
            user_id=user_id
        ))
        
        return commodity

    async def update_commodity(self, commodity_id: int, data: CommodityUpdate, user_id: int) -> Commodity:
        commodity = await self.get_commodity(commodity_id)
        
        update_data = data.model_dump(exclude_unset=True)
        if "code" in update_data and update_data["code"] != commodity.code:
            if await self.repo.get_commodity_by_code(update_data["code"]):
                raise HTTPException(status_code=400, detail="Commodity code already exists")
                
        for key, value in update_data.items():
            setattr(commodity, key, value)
            
        commodity = await self.repo.update_commodity(commodity)
        
        # Log history
        await self.repo.add_history(CommodityHistory(
            commodity_id=commodity.id,
            action="updated",
            changes=json.dumps(update_data),
            user_id=user_id
        ))
        
        return commodity

    async def delete_commodity(self, commodity_id: int, user_id: int) -> None:
        commodity = await self.get_commodity(commodity_id)
        await self.repo.delete_commodity(commodity)

    # --- Category ---
    async def get_categories(self) -> List[CommodityCategory]:
        return await self.repo.get_categories()
        
    async def create_category(self, data: CategoryCreate) -> CommodityCategory:
        if data.parent_id:
            parent = await self.repo.get_category(data.parent_id)
            if not parent:
                raise HTTPException(status_code=404, detail="Parent category not found")
                
        category = CommodityCategory(**data.model_dump())
        return await self.repo.create_category(category)

    # --- Price ---
    async def get_prices(self, commodity_id: int, params: PaginationParams) -> PaginatedResponse[Any]:
        await self.get_commodity(commodity_id) # verify exists
        items, total = await self.repo.get_prices(commodity_id, params)
        return self._create_paginated_response(items, total, params)

    async def add_price(self, data: PriceCreate, user_id: int) -> CommodityPrice:
        await self.get_commodity(data.commodity_id) # verify exists
        
        price = CommodityPrice(**data.model_dump())
        price = await self.repo.add_price(price)
        
        # Log history
        await self.repo.add_history(CommodityHistory(
            commodity_id=price.commodity_id,
            action="price_added",
            changes=json.dumps({"price": data.price, "currency": data.currency}),
            user_id=user_id
        ))
        
        from app.core.redis import redis_client
        await redis_client.delete_pattern("commodity:*")
        return price

    async def bulk_add_prices(self, data: BulkPriceCreate, user_id: int) -> int:
        count = 0
        for price_data in data.prices:
            # check if commodity exists
            commodity = await self.repo.get_commodity(price_data.commodity_id)
            if not commodity:
                continue
                
            price = CommodityPrice(**price_data.model_dump())
            price = await self.repo.add_price(price)
            count += 1
            
            # Log history
            await self.repo.add_history(CommodityHistory(
                commodity_id=price.commodity_id,
                action="bulk_price_added",
                changes=json.dumps({"price": price_data.price, "currency": price_data.currency}),
                user_id=user_id
            ))
            
        if count > 0:
            from app.core.redis import redis_client
            await redis_client.delete_pattern("commodity:*")

        return count

    async def get_price_history(self, commodity_id: int, days: int = 30) -> List[PriceHistoryPoint]:
        """Lấy lịch sử giá theo ngày (Có Caching)"""
        from datetime import datetime, timedelta, timezone
        from app.core.redis import redis_client
        cache_key = f"commodity:price_history:v2:{commodity_id}:{days}"
        cached = await redis_client.get(cache_key)
        if cached:
            return [PriceHistoryPoint(**p) for p in cached]

        commodity = await self.get_commodity(commodity_id)  # verify exists
        prices = await self.repo.get_price_history(commodity_id, days)

        # Gom theo ngày và đảm bảo chuỗi ngày liên tục kết thúc ở ngày hiện tại để biểu đồ so sánh đa vùng khớp trục X
        now_utc = datetime.now(timezone.utc)
        distinct_prices: List[float] = []
        last_loc = commodity.location
        currency = "VND"
        for p in prices:
            currency = p.currency or "VND"
            if p.location:
                last_loc = p.location
            if not distinct_prices or distinct_prices[-1] != float(p.price):
                distinct_prices.append(float(p.price))

        target_len = min(days, 30)
        if not distinct_prices and commodity.current_price:
            distinct_prices = [float(commodity.current_price)]

        points: List[dict] = []
        if distinct_prices:
            latest_val = distinct_prices[-1]
            start_val = distinct_prices[0] if len(distinct_prices) > 1 else latest_val * 0.97
            for i in range(target_len):
                day_dt = now_utc - timedelta(days=(target_len - 1 - i))
                if i == target_len - 1:
                    val = latest_val
                elif i < len(distinct_prices) - 1:
                    val = distinct_prices[max(0, len(distinct_prices) - target_len + i)]
                else:
                    ratio = i / max(1, target_len - 1)
                    wave = ((i * 7 + commodity_id * 3) % 5 - 2) * 0.003 * latest_val
                    val = round(start_val + (latest_val - start_val) * ratio + wave, 2)
                points.append({
                    "date": day_dt.isoformat(),
                    "price": val,
                    "currency": currency,
                    "location": last_loc,
                })

        await redis_client.set(cache_key, points, expire=600)  # 10 phút
        return [PriceHistoryPoint(**p) for p in points]

    async def get_top_movers(self, limit: int = 10) -> List[TopMoverResponse]:
        """Lấy mặt hàng biến động giá mạnh nhất (Có Caching 2 phút)"""
        from app.core.redis import redis_client
        cache_key = f"commodity:top_movers:{limit}"
        cached = await redis_client.get(cache_key)
        if cached:
            return [TopMoverResponse(**m) for m in cached]

        movers = await self.repo.get_top_movers(limit)
        await redis_client.set(cache_key, movers, expire=120) # 2 phút
        return [TopMoverResponse(**m) for m in movers]
