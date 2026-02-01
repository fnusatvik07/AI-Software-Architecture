"""Document-related data models."""

import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    INDEXED = "indexed"
    FAILED = "failed"


class DocumentType(str, Enum):
    PDF = "pdf"
    MARKDOWN = "markdown"
    TEXT = "text"
    HTML = "html"


class DocumentMetadata(BaseModel):
    """Metadata for a document."""

    filename: str
    file_type: DocumentType
    file_size: int  # bytes
    page_count: int | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    custom_metadata: dict = Field(default_factory=dict)


class Document(BaseModel):
    """A document in the system."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    metadata: DocumentMetadata
    status: DocumentStatus = DocumentStatus.PENDING
    chunk_count: int = 0
    error_message: str | None = None


class Chunk(BaseModel):
    """A chunk of a document."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str
    content: str
    chunk_index: int
    start_char: int
    end_char: int
    metadata: dict = Field(default_factory=dict)
    embedding: list[float] | None = None


class DocumentUploadRequest(BaseModel):
    """Request to upload a document."""

    filename: str
    content: str  # Base64 encoded for binary files
    file_type: DocumentType
    metadata: dict = Field(default_factory=dict)


class DocumentUploadResponse(BaseModel):
    """Response after document upload."""

    document_id: str
    status: DocumentStatus
    message: str
    chunk_count: int = 0
