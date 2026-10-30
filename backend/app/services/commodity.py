import json
from typing import List, Optional, Tuple, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.commodity import Commodity, CommodityCategory, CommodityPrice, CommodityHistory
from app.schemas.commodity import (
    CommodityCreate, CommodityUpdate,
    CategoryCreate, CategoryUpdate,
    PriceCreate, BulkPriceCreate, PaginationParams, PaginatedResponse,
    PriceHistoryPoint, TopMoverResponse, CommodityOverviewResponse,
    DomesticPriceItem, WorldDomesticBoardResponse
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
        """Return only recorded price observations, never inferred chart points."""
        from datetime import timezone
        from app.core.redis import redis_client
        cache_key = f"commodity:price_history:v4:{commodity_id}:{days}"
        cached = await redis_client.get(cache_key)
        if cached:
            return [PriceHistoryPoint(**p) for p in cached]

        await self.get_commodity(commodity_id)  # verify exists
        prices = await self.repo.get_price_history(commodity_id, days)
        points = [
            {"date": (p.date if p.date.tzinfo else p.date.replace(tzinfo=timezone.utc)).isoformat(), "price": float(p.price),
             "currency": p.currency or "VND", "location": p.location}
            for p in prices
        ]
        await redis_client.set(cache_key, points, expire=15)
        return [PriceHistoryPoint(**p) for p in points]

    async def get_top_movers(self, limit: int = 10) -> List[TopMoverResponse]:
        """Lấy mặt hàng biến động giá mạnh nhất (cache ngắn cho giao diện tự làm mới)."""
        from app.core.redis import redis_client
        cache_key = f"commodity:top_movers:{limit}"
        cached = await redis_client.get(cache_key)
        if cached:
            return [TopMoverResponse(**m) for m in cached]

        movers = await self.repo.get_top_movers(limit)
        await redis_client.set(cache_key, movers, expire=15)
        return [TopMoverResponse(**m) for m in movers]

    async def get_world_domestic_board(self) -> WorldDomesticBoardResponse:
        """Return recorded domestic prices; world quotes need a verified provider."""
        from datetime import datetime, timezone

        commodities, _ = await self.repo.get_commodities(PaginationParams(size=100))
        domestic_items = []
        for item in commodities:
            latest = item._sorted_prices()[0] if item.prices else None
            if not latest or latest.currency != "VND":
                continue
            if any(place in item.name.lower() for place in ("london", "new york", "ice ", "cbot")):
                continue
            change = item.price_change
            domestic_items.append(DomesticPriceItem(
                code=item.code,
                name=item.name,
                location=latest.location or "Chưa rõ khu vực",
                price_vnd_kg=latest.price,
                change_vnd=change,
                change_percent=item.price_change_percent or 0.0,
                direction="UP" if change > 0 else "DOWN" if change < 0 else "FLAT",
                updated_at=latest.date.isoformat(),
            ))

        return WorldDomesticBoardResponse(
            exchange_rate_usd_vnd=None,
            exchange_rate_updated=None,
            world_items=[],
            domestic_items=domestic_items,
            basis_spreads=[],
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
