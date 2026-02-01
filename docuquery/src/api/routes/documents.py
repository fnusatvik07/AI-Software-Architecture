"""Document management endpoints."""

import logging

from fastapi import APIRouter, HTTPException

from src.core.exceptions import DocumentException
from src.core.orchestrator import Orchestrator
from src.models.documents import DocumentUploadRequest, DocumentUploadResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(request: DocumentUploadRequest):
    """
    Upload and process a document.

    The document will be:
    1. Parsed (PDF, Markdown, Text, HTML supported)
    2. Chunked into smaller pieces
    3. Embedded using OpenAI text-embedding-3-large
    4. Stored in Qdrant vector database
    """
    try:
        orchestrator = Orchestrator.get_instance()
        response = await orchestrator.ingest_document(request)
        return response

    except DocumentException as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/stats")
async def get_stats():
    """Get document statistics from vector store."""
    orchestrator = Orchestrator.get_instance()
    return await orchestrator.vector_store.get_stats()


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete a document and its chunks from the vector store."""
    try:
        orchestrator = Orchestrator.get_instance()
        await orchestrator.vector_store.delete_document(document_id)
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete document") from e
