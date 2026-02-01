"""Health check endpoints."""

from datetime import datetime

from fastapi import APIRouter

from src.core.orchestrator import Orchestrator
from src.models.common import HealthResponse

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def health_check():
    """Check application health."""
    orchestrator = Orchestrator.get_instance()
    health = await orchestrator.health_check()

    return HealthResponse(
        status=health["status"],
        timestamp=datetime.utcnow(),
        version="1.0.0",
        components=health["components"],
    )


@router.get("/ready")
async def readiness_check():
    """Kubernetes readiness probe."""
    orchestrator = Orchestrator.get_instance()
    health = await orchestrator.health_check()

    if health["status"] == "healthy":
        return {"status": "ready"}
    return {"status": "not ready", "components": health["components"]}


@router.get("/live")
async def liveness_check():
    """Kubernetes liveness probe."""
    return {"status": "alive"}
