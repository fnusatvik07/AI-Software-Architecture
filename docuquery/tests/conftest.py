"""Pytest fixtures and configuration."""

import asyncio
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient

from src.api.main import app


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Create async test client."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def sample_document():
    """Sample document for testing."""
    return {
        "filename": "test_doc.md",
        "content": "VGhpcyBpcyBhIHRlc3QgZG9jdW1lbnQu",  # "This is a test document." base64 encoded
        "file_type": "markdown",
    }


@pytest.fixture
def sample_query():
    """Sample query for testing."""
    return {"question": "What is this document about?", "include_sources": True}
