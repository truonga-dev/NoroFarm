import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta, timezone

from app.database.session import AsyncSessionLocal
from app.models.commodity import Commodity, CommodityCategory, CommodityPrice

pytestmark = pytest.mark.asyncio

async def test_get_commodities(client: AsyncClient):
    response = await client.get("/api/v1/commodities")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "items" in data["data"]

async def test_get_commodity_overview(client: AsyncClient):
    response = await client.get("/api/v1/commodities/overview")
    assert response.status_code == 200
    data = response.json()["data"]
    assert isinstance(data, list)
    assert all("prices" in item for item in data)


async def test_price_history_contains_only_recorded_points(client: AsyncClient):
    now = datetime.now(timezone.utc)
    async with AsyncSessionLocal() as db:
        category = CommodityCategory(name="history-test")
        db.add(category)
        await db.flush()
        commodity = Commodity(code="HISTORY_TEST", name="History test", unit="kg", category_id=category.id)
        db.add(commodity)
        await db.flush()
        db.add_all([
            CommodityPrice(commodity_id=commodity.id, price=101, currency="VND", date=now - timedelta(days=3)),
            CommodityPrice(commodity_id=commodity.id, price=99, currency="VND", date=now - timedelta(days=1)),
        ])
        await db.commit()
        commodity_id = commodity.id

    response = await client.get(f"/api/v1/commodities/{commodity_id}/price-history?days=7")
    assert response.status_code == 200
    points = response.json()["data"]
    assert [point["price"] for point in points] == [101, 99]
    assert len(points) == 2
    assert datetime.fromisoformat(points[0]["date"]).date() == (now - timedelta(days=3)).date()
    assert datetime.fromisoformat(points[0]["date"]).utcoffset() == timedelta(0)

    async with AsyncSessionLocal() as db:
        await db.delete(await db.get(Commodity, commodity_id))
        await db.delete(await db.get(CommodityCategory, category.id))
        await db.commit()
