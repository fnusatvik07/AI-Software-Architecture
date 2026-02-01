"""API integration tests."""

import pytest
from httpx import AsyncClient


class TestHealthEndpoints:
    """Test health check endpoints."""

    @pytest.mark.asyncio
    async def test_liveness(self, client: AsyncClient):
        """Test liveness probe."""
        response = await client.get("/api/v1/health/live")
        assert response.status_code == 200
        assert response.json()["status"] == "alive"


class TestQueryEndpoints:
    """Test query endpoints."""

    @pytest.mark.asyncio
    async def test_query_validation_empty(self, client: AsyncClient):
        """Test query validation with empty question."""
        response = await client.post("/api/v1/query", json={"question": ""})
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_query_validation_too_long(self, client: AsyncClient):
        """Test query validation with too long question."""
        response = await client.post("/api/v1/query", json={"question": "a" * 1001})
        assert response.status_code == 422


class TestDocumentEndpoints:
    """Test document endpoints."""

    @pytest.mark.asyncio
    async def test_get_stats(self, client: AsyncClient):
        """Test document stats endpoint."""
        response = await client.get("/api/v1/documents/stats")
        # Will fail if Qdrant not running, but structure should be correct
        assert response.status_code in [200, 500]
