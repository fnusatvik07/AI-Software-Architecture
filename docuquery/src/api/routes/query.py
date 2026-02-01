"""Query endpoints."""

import logging

from fastapi import APIRouter, HTTPException

from src.core.exceptions import DocuQueryException
from src.core.orchestrator import Orchestrator
from src.models.queries import QueryRequest, QueryResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    """
    Ask a question about the documents.

    The system will:
    1. Embed the question using OpenAI text-embedding-3-large
    2. Search for relevant document chunks in Qdrant
    3. Generate an answer using GPT-4o with context
    4. Return the answer with source citations
    """
    try:
        orchestrator = Orchestrator.get_instance()
        response = await orchestrator.query(request)
        return response

    except DocuQueryException as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e

    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e
