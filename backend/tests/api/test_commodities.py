import pytest
from httpx import AsyncClient

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
