import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_get_banners(client: AsyncClient):
    response = await client.get("/api/v1/admin/banners")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
