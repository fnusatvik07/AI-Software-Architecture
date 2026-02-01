"""Query and response data models."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class Source(BaseModel):
    """A source document chunk used in the answer."""

    document_id: str
    document_name: str
    chunk_id: str
    content: str
    relevance_score: float
    page_number: int | None = None


class QueryRequest(BaseModel):
    """Request to ask a question."""

    question: str = Field(..., min_length=1, max_length=1000)
    conversation_id: str | None = None
    top_k: int | None = Field(default=None, ge=1, le=20)
    include_sources: bool = True


class QueryResponse(BaseModel):
    """Response to a question."""

    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    sources: list[Source] = Field(default_factory=list)
    confidence: float | None = None
    latency_ms: int
    tokens_used: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
