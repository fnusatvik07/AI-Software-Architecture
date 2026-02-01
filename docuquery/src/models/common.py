"""Common/shared data models."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    timestamp: datetime
    version: str
    components: dict


class ErrorResponse(BaseModel):
    """Standard error response."""

    error: str
    message: str
    detail: str | None = None
    timestamp: datetime
    request_id: str | None = None


class APIResponse(BaseModel):
    """Generic API response wrapper."""

    success: bool
    data: Any | None = None
    error: ErrorResponse | None = None
    metadata: dict = {}
