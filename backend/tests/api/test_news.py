import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_get_articles(client: AsyncClient):
    response = await client.get("/api/v1/news")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "items" in data["data"]
