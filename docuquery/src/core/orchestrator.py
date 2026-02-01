"""
Main orchestrator that ties all components together.
Acts as the central coordinator for the RAG pipeline.
"""

import logging
from typing import Optional

from src.core.query_engine import QueryEngine
from src.ingestion.processor import DocumentProcessor
from src.llm.gateway import LLMGateway
from src.models.documents import DocumentUploadRequest, DocumentUploadResponse
from src.models.queries import QueryRequest, QueryResponse
from src.prompts.manager import PromptManager
from src.retrieval.embeddings import EmbeddingService
from src.retrieval.vector_store import VectorStore

logger = logging.getLogger(__name__)


class Orchestrator:
    """
    Central orchestrator for the DocuQuery application.

    Manages:
    - Document ingestion and processing
    - Query processing
    - Component lifecycle
    """

    _instance: Optional["Orchestrator"] = None

    def __init__(self):
        """Initialize all components."""
        logger.info("Initializing Orchestrator...")

        # Initialize services
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStore()
        self.llm_gateway = LLMGateway()
        self.prompt_manager = PromptManager()
        self.document_processor = DocumentProcessor(
            embedding_service=self.embedding_service, vector_store=self.vector_store
        )

        # Initialize query engine
        self.query_engine = QueryEngine(
            vector_store=self.vector_store,
            embedding_service=self.embedding_service,
            llm_gateway=self.llm_gateway,
            prompt_manager=self.prompt_manager,
        )

        logger.info("Orchestrator initialized successfully")

    @classmethod
    def get_instance(cls) -> "Orchestrator":
        """Get singleton instance of Orchestrator."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    async def ingest_document(
        self, request: DocumentUploadRequest
    ) -> DocumentUploadResponse:
        """Ingest a new document into the system."""
        logger.info(f"Ingesting document: {request.filename}")
        return await self.document_processor.process(request)

    async def query(self, request: QueryRequest) -> QueryResponse:
        """Process a user query."""
        return await self.query_engine.query(request)

    async def health_check(self) -> dict:
        """Check health of all components."""
        components = {}

        try:
            await self.vector_store.ping()
            components["vector_store"] = {"status": "healthy"}
        except Exception as e:
            components["vector_store"] = {"status": "unhealthy", "error": str(e)}

        try:
            health = await self.llm_gateway.health_check()
            if any(health.values()):
                components["llm"] = {"status": "healthy", "providers": health}
            else:
                components["llm"] = {"status": "unhealthy", "providers": health}
        except Exception as e:
            components["llm"] = {"status": "unhealthy", "error": str(e)}

        try:
            await self.embedding_service.health_check()
            components["embeddings"] = {"status": "healthy"}
        except Exception as e:
            components["embeddings"] = {"status": "unhealthy", "error": str(e)}

        all_healthy = all(c["status"] == "healthy" for c in components.values())

        return {
            "status": "healthy" if all_healthy else "degraded",
            "components": components,
        }

    async def shutdown(self):
        """Gracefully shutdown all components."""
        logger.info("Shutting down Orchestrator...")
        await self.vector_store.close()
        logger.info("Orchestrator shutdown complete")
