from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc, and_
from sqlalchemy.orm import joinedload, selectinload
from app.models.commodity import Commodity, CommodityCategory, CommodityPrice, CommodityHistory
from app.schemas.commodity import PaginationParams

class CommodityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _paginate(self, query, params: PaginationParams) -> Tuple[List[Any], int]:
        total = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total_count = total.scalar() or 0

        query = query.offset((params.page - 1) * params.size).limit(params.size)
        result = await self.db.execute(query)
        return result.unique().scalars().all(), total_count

    # --- Commodity ---
    async def get_commodity(self, commodity_id: int) -> Optional[Commodity]:
        query = select(Commodity).options(
            joinedload(Commodity.category),
            selectinload(Commodity.prices)
        ).where(Commodity.id == commodity_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_commodity_by_code(self, code: str) -> Optional[Commodity]:
        query = select(Commodity).where(Commodity.code == code)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_commodities(self, params: PaginationParams, search: Optional[str] = None, category_id: Optional[int] = None, category: Optional[str] = None) -> Tuple[List[Commodity], int]:
        query = select(Commodity).options(
            joinedload(Commodity.category),
            selectinload(Commodity.prices)
        )
        
        if search:
            query = query.where((Commodity.name.ilike(f"%{search}%")) | (Commodity.code.ilike(f"%{search}%")))
        if category_id:
            query = query.where(Commodity.category_id == category_id)
        if category:
            cat_key = category.strip().lower()
            if cat_key in ("coffee", "ca-phe", "cà phê"):
                query = query.outerjoin(CommodityCategory).where(
                    (Commodity.code.ilike("coffee%")) |
                    (Commodity.code.ilike("ca_phe%")) |
                    (Commodity.name.ilike("%cà phê%")) |
                    (CommodityCategory.name.ilike("%cà phê%"))
                )
            else:
                query = query.outerjoin(CommodityCategory).where(
                    (Commodity.code.ilike(f"%{cat_key}%")) |
                    (Commodity.name.ilike(f"%{cat_key}%")) |
                    (CommodityCategory.name.ilike(f"%{cat_key}%"))
                )
            
        if params.sort_by and hasattr(Commodity, params.sort_by):
            order_col = getattr(Commodity, params.sort_by)
            query = query.order_by(desc(order_col) if params.sort_desc else asc(order_col))
            
        return await self._paginate(query, params)

    async def get_overview(self) -> List[dict]:
        """Small dashboard payload: one latest price per commodity and location."""
        rows = await self.db.execute(
            select(Commodity.id, Commodity.code, Commodity.name, Commodity.unit)
            .order_by(Commodity.name)
        )
        commodities = [dict(row._mapping, prices=[]) for row in rows]
        if not commodities:
            return []

        ids = [item["id"] for item in commodities]
        ranked = (
            select(
                CommodityPrice.id.label("price_id"),
                func.row_number().over(
                    partition_by=(CommodityPrice.commodity_id, CommodityPrice.location),
                    order_by=(CommodityPrice.date.desc(), CommodityPrice.id.desc()),
                ).label("position"),
            )
            .where(CommodityPrice.commodity_id.in_(ids))
            .subquery()
        )
        price_rows = await self.db.execute(
            select(CommodityPrice)
            .join(ranked, CommodityPrice.id == ranked.c.price_id)
            .where(ranked.c.position == 1)
        )
        by_id = {item["id"]: item for item in commodities}
        for price in price_rows.scalars():
            by_id[price.commodity_id]["prices"].append({
                "price": price.price,
                "currency": price.currency,
                "location": price.location,
                "date": price.date,
            })
        return commodities

    async def create_commodity(self, commodity: Commodity) -> Commodity:
        self.db.add(commodity)
        await self.db.commit()
        await self.db.refresh(commodity)
        return commodity

    async def update_commodity(self, commodity: Commodity) -> Commodity:
        self.db.add(commodity)
        await self.db.commit()
        await self.db.refresh(commodity)
        return commodity

    async def delete_commodity(self, commodity: Commodity) -> None:
        await self.db.delete(commodity)
        await self.db.commit()

    # --- Category ---
    async def get_category(self, category_id: int) -> Optional[CommodityCategory]:
        query = select(CommodityCategory).where(CommodityCategory.id == category_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_categories(self) -> List[CommodityCategory]:
        query = select(CommodityCategory)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_category(self, category: CommodityCategory) -> CommodityCategory:
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def update_category(self, category: CommodityCategory) -> CommodityCategory:
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def delete_category(self, category: CommodityCategory) -> None:
        await self.db.delete(category)
        await self.db.commit()

    # --- Price ---
    async def get_prices(self, commodity_id: int, params: PaginationParams) -> Tuple[List[CommodityPrice], int]:
        query = select(CommodityPrice).where(CommodityPrice.commodity_id == commodity_id)
        query = query.order_by(desc(CommodityPrice.date))
        return await self._paginate(query, params)

    async def add_price(self, price: CommodityPrice) -> CommodityPrice:
        self.db.add(price)
        await self.db.commit()
        await self.db.refresh(price)
        return price

    async def get_price_history(self, commodity_id: int, days: int = 30) -> List[CommodityPrice]:
        """Lấy lịch sử giá theo ngày trong khoảng `days` ngày gần nhất"""
        since = datetime.now(timezone.utc) - timedelta(days=days)
        query = (
            select(CommodityPrice)
            .where(and_(
                CommodityPrice.commodity_id == commodity_id,
                CommodityPrice.date >= since
            ))
            .order_by(asc(CommodityPrice.date))
        )
        result = await self.db.execute(query)
        recent_rows = list(result.scalars().all())
        distinct_days = {r.date.date() for r in recent_rows if r.date}
        if len(distinct_days) >= min(days, 5):
            return recent_rows

        # Fallback: lấy các bản ghi lịch sử gần nhất của mặt hàng này để dựng chuỗi ngày liên tục
        fallback_q = (
            select(CommodityPrice)
            .where(CommodityPrice.commodity_id == commodity_id)
            .order_by(desc(CommodityPrice.date), desc(CommodityPrice.id))
            .limit(max(days, 30))
        )
        fb_res = await self.db.execute(fallback_q)
        fb_rows = list(fb_res.scalars().all())
        fb_rows.reverse()
        return fb_rows

    async def get_top_movers(self, limit: int = 10) -> List[dict]:
        """
        Lấy danh sách mặt hàng có biến động giá mạnh nhất:
        So sánh giá mới nhất với giá trước đó 1 bước.
        """
        # Sub-query: lấy giá mới nhất của từng mặt hàng
        latest_subq = (
            select(
                CommodityPrice.commodity_id,
                func.max(CommodityPrice.date).label("max_date")
            )
            .group_by(CommodityPrice.commodity_id)
            .subquery()
        )
        latest_price_q = (
            select(CommodityPrice)
            .join(latest_subq, and_(
                CommodityPrice.commodity_id == latest_subq.c.commodity_id,
                CommodityPrice.date == latest_subq.c.max_date
            ))
        )
        latest_result = await self.db.execute(latest_price_q)
        latest_prices = {p.commodity_id: p for p in latest_result.scalars().all()}

        # Lấy thông tin commodity
        if not latest_prices:
            return []

        commodity_ids = list(latest_prices.keys())
        commodities_q = (
            select(Commodity)
            .options(joinedload(Commodity.category), selectinload(Commodity.prices))
            .where(Commodity.id.in_(commodity_ids))
        )
        c_result = await self.db.execute(commodities_q)
        commodities = {c.id: c for c in c_result.unique().scalars().all()}

        movers = []
        for cid, latest in latest_prices.items():
            commodity = commodities.get(cid)
            if not commodity:
                continue

            # Lấy giá trước đó (ưu tiên mốc giá khác với giá hiện tại để tránh trùng lặp snapshot theo giờ)
            prices_sorted = sorted(commodity.prices, key=lambda p: (p.date, p.id or 0), reverse=True)
            current_price = latest.price
            prev_price = None
            for p in prices_sorted[1:]:
                if p.price != current_price:
                    prev_price = p.price
                    break
            if prev_price is None and len(prices_sorted) > 1:
                prev_price = prices_sorted[1].price

            change_pct = 0.0
            if prev_price and prev_price > 0:
                change_pct = round(((current_price - prev_price) / prev_price) * 100, 2)

            movers.append({
                "id": commodity.id,
                "code": commodity.code,
                "name": commodity.name,
                "unit": commodity.unit,
                "category": commodity.category.name if commodity.category else None,
                "current_price": current_price,
                "prev_price": prev_price,
                "change_pct": change_pct,
                "currency": latest.currency,
                "updated_at": latest.date,
            })

        # Sắp xếp theo |change_pct| giảm dần
        movers.sort(key=lambda x: abs(x["change_pct"] or 0), reverse=True)
        return movers[:limit]

    # --- History ---
    async def add_history(self, history: CommodityHistory) -> CommodityHistory:
        self.db.add(history)
        await self.db.commit()
        await self.db.refresh(history)
        return history
