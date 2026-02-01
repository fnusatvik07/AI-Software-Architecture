"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from src.api.middleware.error_handler import error_handler_middleware
from src.api.middleware.logging import LoggingMiddleware
from src.api.routes import documents, health, query
from src.core.orchestrator import Orchestrator

# Setup logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info("Starting DocuQuery API...")

    orchestrator = Orchestrator.get_instance()
    await orchestrator.vector_store.initialize()

    logger.info("DocuQuery API started successfully")
    yield

    logger.info("Shutting down DocuQuery API...")
    await orchestrator.shutdown()


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""

    app = FastAPI(
        title="DocuQuery API",
        description="AI-powered document Q&A system using OpenAI GPT-4o",
        version="1.0.0",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.debug else [],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middleware
    app.middleware("http")(error_handler_middleware)
    app.add_middleware(LoggingMiddleware)

    # Include routers
    app.include_router(
        health.router, prefix=f"{settings.api_prefix}/health", tags=["Health"]
    )
    app.include_router(
        documents.router, prefix=f"{settings.api_prefix}/documents", tags=["Documents"]
    )
    app.include_router(
        query.router, prefix=f"{settings.api_prefix}/query", tags=["Query"]
    )

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
