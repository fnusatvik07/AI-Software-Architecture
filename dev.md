# Stage 3: Development Environment

> **Goal:** Transform the POC into a properly engineered application with clean architecture, testing, error handling, and a foundation ready for production.

This is where we transition from "it works on my machine" to "it's ready for a team to work on."

---

## 📋 Table of Contents

1. [Development Philosophy](#1-development-philosophy)
2. [Project Structure](#2-project-structure)
3. [Configuration Management](#3-configuration-management)
4. [Data Models](#4-data-models)
5. [Core Business Logic](#5-core-business-logic)
6. [Document Ingestion Pipeline](#6-document-ingestion-pipeline)
7. [Retrieval Layer](#7-retrieval-layer)
8. [LLM Integration](#8-llm-integration)
9. [Prompt Management](#9-prompt-management)
10. [API Layer](#10-api-layer)
11. [Middleware](#11-middleware)
12. [Docker Setup](#12-docker-setup)
13. [Testing](#13-testing)
14. [CI/CD Pipeline](#14-cicd-pipeline)
15. [Running the Application](#15-running-the-application)
16. [Comparison: POC vs Development](#16-comparison-poc-vs-development)
17. [Exit Criteria](#17-exit-criteria)

---

## 1. Development Philosophy

### POC vs Development Mindset Shift

| Aspect | POC Mindset | Development Mindset |
|--------|-------------|---------------------|
| Code | "Make it work" | "Make it right" |
| Structure | Single file | Modular architecture |
| Errors | Ignore them | Handle gracefully |
| Config | Hardcoded | Environment-based |
| Testing | Manual | Automated |
| Documentation | Minimal | Comprehensive |
| Collaboration | Solo | Team-ready |

### Key Principles

```
1. Separation of Concerns — Each module has one job
2. Configuration over Code — No hardcoded values
3. Fail Gracefully — Every error is handled
4. Test Everything — If it's not tested, it's broken
5. Document as You Go — Code should be self-explanatory
6. Think Production — Build like it's going live tomorrow
```

---

## 2. Project Structure

### Complete Directory Layout

```
docuquery/
│
├── src/                          # Source code
│   ├── __init__.py
│   │
│   ├── api/                      # API layer
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI application
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py         # Health check endpoints
│   │   │   ├── documents.py      # Document management endpoints
│   │   │   └── query.py          # Q&A endpoints
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── logging.py        # Request logging
│   │   │   ├── error_handler.py  # Global error handling
│   │   │   └── rate_limit.py     # Rate limiting
│   │   └── dependencies.py       # Dependency injection
│   │
│   ├── core/                     # Core business logic
│   │   ├── __init__.py
│   │   ├── orchestrator.py       # Main RAG orchestration
│   │   ├── query_engine.py       # Query processing
│   │   └── exceptions.py         # Custom exceptions
│   │
│   ├── ingestion/                # Document processing
│   │   ├── __init__.py
│   │   ├── loader.py             # Document loaders
│   │   ├── chunker.py            # Text chunking
│   │   ├── processor.py          # Processing pipeline
│   │   └── parsers/
│   │       ├── __init__.py
│   │       ├── pdf_parser.py
│   │       ├── markdown_parser.py
│   │       └── text_parser.py
│   │
│   ├── retrieval/                # Vector search
│   │   ├── __init__.py
│   │   ├── embeddings.py         # Embedding generation
│   │   ├── vector_store.py       # Vector DB operations
│   │   └── reranker.py           # Result reranking
│   │
│   ├── llm/                      # LLM integration
│   │   ├── __init__.py
│   │   ├── client.py             # Unified LLM interface
│   │   ├── providers/
│   │   │   ├── __init__.py
│   │   │   ├── anthropic.py      # Claude provider
│   │   │   ├── openai.py         # OpenAI provider
│   │   │   └── base.py           # Base provider class
│   │   └── gateway.py            # LLM gateway with fallbacks
│   │
│   ├── prompts/                  # Prompt management
│   │   ├── __init__.py
│   │   ├── manager.py            # Prompt loading/versioning
│   │   └── templates/
│   │       ├── v1/
│   │       │   ├── system.txt
│   │       │   └── query.txt
│   │       └── v2/
│   │           ├── system.txt
│   │           └── query.txt
│   │
│   ├── models/                   # Data models
│   │   ├── __init__.py
│   │   ├── documents.py          # Document models
│   │   ├── queries.py            # Query/response models
│   │   └── common.py             # Shared models
│   │
│   └── utils/                    # Utilities
│       ├── __init__.py
│       ├── tokens.py             # Token counting
│       ├── sanitization.py       # Input cleaning
│       └── logging.py            # Logging setup
│
├── tests/                        # Test suite
│   ├── __init__.py
│   ├── conftest.py               # Pytest fixtures
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── test_chunker.py
│   │   ├── test_embeddings.py
│   │   ├── test_prompt_manager.py
│   │   └── test_query_engine.py
│   ├── integration/
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   ├── test_ingestion_pipeline.py
│   │   └── test_rag_flow.py
│   └── evals/
│       ├── __init__.py
│       ├── datasets/
│       │   └── golden_set.jsonl
│       ├── run_eval.py
│       └── judges/
│           └── quality_judge.py
│
├── scripts/                      # Utility scripts
│   ├── seed_documents.py         # Load initial documents
│   ├── run_evals.py              # Run evaluation suite
│   ├── generate_embeddings.py    # Batch embedding generation
│   └── cost_report.py            # Cost analysis
│
├── config/                       # Configuration files
│   ├── settings.py               # Pydantic settings
│   ├── dev.yaml                  # Dev environment config
│   ├── staging.yaml              # Staging config
│   └── prod.yaml                 # Production config
│
├── docker/                       # Docker files
│   ├── Dockerfile                # Main application
│   ├── Dockerfile.dev            # Development with hot reload
│   └── docker-compose.yml        # Full stack (app + Qdrant)
│
├── docs/                         # Documentation
│   ├── api.md                    # API documentation
│   ├── architecture.md           # Architecture overview
│   └── deployment.md             # Deployment guide
│
├── .github/                      # GitHub configuration
│   └── workflows/
│       ├── ci.yml                # CI pipeline
│       └── deploy-dev.yml        # Deploy to dev
│
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── pyproject.toml                # Project configuration
├── requirements.txt              # Production dependencies
├── requirements-dev.txt          # Development dependencies
├── Makefile                      # Common commands
└── README.md                     # Project documentation
```

---

## 3. Configuration Management

### Environment-Based Configuration

All configuration is managed through environment variables with validation using Pydantic Settings.

**config/settings.py**

```python
"""
Application settings using Pydantic Settings.
Loads from environment variables with validation.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
from enum import Enum


class Environment(str, Enum):
    DEV = "dev"
    STAGING = "staging"
    PROD = "prod"


class LLMProvider(str, Enum):
    ANTHROPIC = "anthropic"
    OPENAI = "openai"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Environment
    environment: Environment = Field(default=Environment.DEV)
    debug: bool = Field(default=False)
    
    # API Configuration
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    api_prefix: str = Field(default="/api/v1")
    
    # API Keys
    openai_api_key: str = Field(..., description="OpenAI API key for embeddings")
    anthropic_api_key: str = Field(..., description="Anthropic API key for Claude")
    
    # LLM Configuration
    llm_provider: LLMProvider = Field(default=LLMProvider.ANTHROPIC)
    llm_model: str = Field(default="claude-3-5-sonnet-20241022")
    llm_temperature: float = Field(default=0.0, ge=0.0, le=1.0)
    llm_max_tokens: int = Field(default=1024)
    llm_timeout: int = Field(default=30)
    
    # Embedding Configuration
    embedding_model: str = Field(default="text-embedding-3-small")
    embedding_dimensions: int = Field(default=1536)
    
    # Vector Store Configuration
    qdrant_host: str = Field(default="localhost")
    qdrant_port: int = Field(default=6333)
    qdrant_collection: str = Field(default="docuquery")
    
    # Chunking Configuration
    chunk_size: int = Field(default=500, ge=100, le=2000)
    chunk_overlap: int = Field(default=50, ge=0, le=200)
    
    # Retrieval Configuration
    retrieval_top_k: int = Field(default=5, ge=1, le=20)
    retrieval_score_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100)
    rate_limit_window: int = Field(default=60)  # seconds
    
    # Logging
    log_level: str = Field(default="INFO")
    log_format: str = Field(default="json")
    
    # Prompt Configuration
    prompt_version: str = Field(default="v1")
    prompts_dir: str = Field(default="src/prompts/templates")
    
    # Feature Flags
    enable_reranking: bool = Field(default=False)
    enable_semantic_cache: bool = Field(default=False)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Singleton instance
settings = Settings()
```

### Environment File Template

**.env.example**

```bash
# ===========================================
# DocuQuery Configuration
# ===========================================

# Environment: dev, staging, prod
ENVIRONMENT=dev
DEBUG=true

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# ===========================================
# API Keys (Required)
# ===========================================

# OpenAI - for embeddings
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-key

# Anthropic - for LLM (Claude)
# Get your key at: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# ===========================================
# LLM Configuration
# ===========================================

LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-5-sonnet-20241022
LLM_TEMPERATURE=0.0
LLM_MAX_TOKENS=1024
LLM_TIMEOUT=30

# ===========================================
# Embedding Configuration
# ===========================================

EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

# ===========================================
# Vector Store (Qdrant)
# ===========================================

QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_COLLECTION=docuquery

# ===========================================
# Chunking Configuration
# ===========================================

CHUNK_SIZE=500
CHUNK_OVERLAP=50

# ===========================================
# Retrieval Configuration
# ===========================================

RETRIEVAL_TOP_K=5
RETRIEVAL_SCORE_THRESHOLD=0.7

# ===========================================
# Rate Limiting
# ===========================================

RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# ===========================================
# Logging
# ===========================================

LOG_LEVEL=INFO
LOG_FORMAT=json

# ===========================================
# Feature Flags
# ===========================================

ENABLE_RERANKING=false
ENABLE_SEMANTIC_CACHE=false

# ===========================================
# Prompt Configuration
# ===========================================

PROMPT_VERSION=v1
```

---

## 4. Data Models

### Document Models

**src/models/documents.py**

```python
"""Document-related data models."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid


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
    page_count: Optional[int] = None
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
    error_message: Optional[str] = None


class Chunk(BaseModel):
    """A chunk of a document."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str
    content: str
    chunk_index: int
    start_char: int
    end_char: int
    metadata: dict = Field(default_factory=dict)
    embedding: Optional[List[float]] = None


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
```

### Query Models

**src/models/queries.py**

```python
"""Query and response data models."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class Source(BaseModel):
    """A source document chunk used in the answer."""
    document_id: str
    document_name: str
    chunk_id: str
    content: str
    relevance_score: float
    page_number: Optional[int] = None


class QueryRequest(BaseModel):
    """Request to ask a question."""
    question: str = Field(..., min_length=1, max_length=1000)
    conversation_id: Optional[str] = None
    top_k: Optional[int] = Field(default=None, ge=1, le=20)
    include_sources: bool = True


class QueryResponse(BaseModel):
    """Response to a question."""
    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    sources: List[Source] = Field(default_factory=list)
    confidence: Optional[float] = None
    latency_ms: int
    tokens_used: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
```

### Common Models

**src/models/common.py**

```python
"""Common/shared data models."""

from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


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
    detail: Optional[str] = None
    timestamp: datetime
    request_id: Optional[str] = None


class APIResponse(BaseModel):
    """Generic API response wrapper."""
    success: bool
    data: Optional[Any] = None
    error: Optional[ErrorResponse] = None
    metadata: dict = {}
```

---

## 5. Core Business Logic

### Custom Exceptions

**src/core/exceptions.py**

```python
"""Custom exceptions for the application."""

from typing import Optional


class DocuQueryException(Exception):
    """Base exception for all application errors."""
    
    def __init__(self, message: str, detail: Optional[str] = None):
        self.message = message
        self.detail = detail
        super().__init__(self.message)


class DocumentException(DocuQueryException):
    """Document-related errors."""
    pass


class DocumentNotFoundError(DocumentException):
    """Document not found."""
    pass


class DocumentProcessingError(DocumentException):
    """Error processing document."""
    pass


class RetrievalException(DocuQueryException):
    """Retrieval-related errors."""
    pass


class EmbeddingError(RetrievalException):
    """Error generating embeddings."""
    pass


class VectorStoreError(RetrievalException):
    """Vector store operation error."""
    pass


class LLMException(DocuQueryException):
    """LLM-related errors."""
    pass


class LLMTimeoutError(LLMException):
    """LLM request timed out."""
    pass


class LLMRateLimitError(LLMException):
    """LLM rate limit exceeded."""
    pass


class LLMProviderError(LLMException):
    """LLM provider returned an error."""
    pass


class ConfigurationError(DocuQueryException):
    """Configuration error."""
    pass


class ValidationError(DocuQueryException):
    """Input validation error."""
    pass
```

### Query Engine

**src/core/query_engine.py**

```python
"""Query processing engine."""

import time
from typing import List, Tuple
import logging

from src.models.queries import QueryRequest, QueryResponse, Source
from src.retrieval.vector_store import VectorStore
from src.retrieval.embeddings import EmbeddingService
from src.llm.gateway import LLMGateway
from src.prompts.manager import PromptManager
from src.core.exceptions import RetrievalException, LLMException
from config.settings import settings

logger = logging.getLogger(__name__)


class QueryEngine:
    """
    Processes user queries through the RAG pipeline.
    
    Flow:
    1. Embed the question
    2. Retrieve relevant chunks
    3. Build context from chunks
    4. Generate answer with LLM
    5. Format and return response
    """
    
    def __init__(
        self,
        vector_store: VectorStore,
        embedding_service: EmbeddingService,
        llm_gateway: LLMGateway,
        prompt_manager: PromptManager
    ):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.llm_gateway = llm_gateway
        self.prompt_manager = prompt_manager
    
    async def query(self, request: QueryRequest) -> QueryResponse:
        """Process a query and return an answer with sources."""
        start_time = time.time()
        tokens_used = 0
        
        try:
            # Step 1: Embed the question
            logger.info(f"Processing query: {request.question[:50]}...")
            question_embedding = await self.embedding_service.embed_text(
                request.question
            )
            
            # Step 2: Retrieve relevant chunks
            top_k = request.top_k or settings.retrieval_top_k
            retrieved_chunks = await self.vector_store.search(
                embedding=question_embedding,
                top_k=top_k,
                score_threshold=settings.retrieval_score_threshold
            )
            
            if not retrieved_chunks:
                logger.warning("No relevant chunks found for query")
                return self._create_no_results_response(request, start_time)
            
            # Step 3: Build context
            context, sources = self._build_context(retrieved_chunks)
            
            # Step 4: Generate answer
            system_prompt = self.prompt_manager.get_prompt("system")
            query_prompt = self.prompt_manager.render_prompt(
                "query",
                context=context,
                question=request.question
            )
            
            llm_response = await self.llm_gateway.complete(
                system_prompt=system_prompt,
                user_prompt=query_prompt
            )
            
            tokens_used = llm_response.get("tokens_used", 0)
            
            # Step 5: Build response
            latency_ms = int((time.time() - start_time) * 1000)
            
            return QueryResponse(
                question=request.question,
                answer=llm_response["content"],
                sources=sources if request.include_sources else [],
                latency_ms=latency_ms,
                tokens_used=tokens_used
            )
            
        except (RetrievalException, LLMException):
            raise
        except Exception as e:
            logger.exception(f"Unexpected error processing query: {e}")
            raise
    
    def _build_context(self, chunks: List[dict]) -> Tuple[str, List[Source]]:
        """Build context string and source list from chunks."""
        context_parts = []
        sources = []
        
        for i, chunk in enumerate(chunks, 1):
            source_name = chunk["metadata"].get("filename", "Unknown")
            context_parts.append(
                f"[Source {i}: {source_name}]\n{chunk['content']}"
            )
            
            sources.append(Source(
                document_id=chunk["metadata"].get("document_id", ""),
                document_name=source_name,
                chunk_id=chunk["id"],
                content=chunk["content"],
                relevance_score=chunk["score"],
                page_number=chunk["metadata"].get("page_number")
            ))
        
        context = "\n\n---\n\n".join(context_parts)
        return context, sources
    
    def _create_no_results_response(
        self, 
        request: QueryRequest, 
        start_time: float
    ) -> QueryResponse:
        """Create response when no relevant documents found."""
        latency_ms = int((time.time() - start_time) * 1000)
        
        return QueryResponse(
            question=request.question,
            answer="I don't have any relevant information in the documents to answer this question.",
            sources=[],
            latency_ms=latency_ms,
            tokens_used=0
        )
```

### Main Orchestrator

**src/core/orchestrator.py**

```python
"""
Main orchestrator that ties all components together.
Acts as the central coordinator for the RAG pipeline.
"""

import logging
from typing import Optional

from src.core.query_engine import QueryEngine
from src.ingestion.processor import DocumentProcessor
from src.retrieval.vector_store import VectorStore
from src.retrieval.embeddings import EmbeddingService
from src.llm.gateway import LLMGateway
from src.prompts.manager import PromptManager
from src.models.documents import DocumentUploadRequest, DocumentUploadResponse
from src.models.queries import QueryRequest, QueryResponse

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
            embedding_service=self.embedding_service,
            vector_store=self.vector_store
        )
        
        # Initialize query engine
        self.query_engine = QueryEngine(
            vector_store=self.vector_store,
            embedding_service=self.embedding_service,
            llm_gateway=self.llm_gateway,
            prompt_manager=self.prompt_manager
        )
        
        logger.info("Orchestrator initialized successfully")
    
    @classmethod
    def get_instance(cls) -> "Orchestrator":
        """Get singleton instance of Orchestrator."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    async def ingest_document(
        self, 
        request: DocumentUploadRequest
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
            await self.llm_gateway.health_check()
            components["llm"] = {"status": "healthy"}
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
            "components": components
        }
    
    async def shutdown(self):
        """Gracefully shutdown all components."""
        logger.info("Shutting down Orchestrator...")
        await self.vector_store.close()
        logger.info("Orchestrator shutdown complete")
```

---

## 6. Document Ingestion Pipeline

### Document Loader

**src/ingestion/loader.py**

```python
"""Document loading utilities."""

import base64
from pathlib import Path
from typing import Union
import logging

from src.models.documents import DocumentType, DocumentMetadata, Document
from src.core.exceptions import DocumentProcessingError

logger = logging.getLogger(__name__)


class DocumentLoader:
    """Loads documents from various sources."""
    
    SUPPORTED_EXTENSIONS = {
        ".pdf": DocumentType.PDF,
        ".md": DocumentType.MARKDOWN,
        ".markdown": DocumentType.MARKDOWN,
        ".txt": DocumentType.TEXT,
        ".html": DocumentType.HTML,
    }
    
    def load_from_file(self, file_path: Union[str, Path]) -> Document:
        """Load document from file path."""
        path = Path(file_path)
        
        if not path.exists():
            raise DocumentProcessingError(f"File not found: {file_path}")
        
        extension = path.suffix.lower()
        if extension not in self.SUPPORTED_EXTENSIONS:
            raise DocumentProcessingError(f"Unsupported file type: {extension}")
        
        file_type = self.SUPPORTED_EXTENSIONS[extension]
        
        if file_type == DocumentType.PDF:
            content = self._load_pdf(path)
        else:
            content = path.read_text(encoding="utf-8")
        
        metadata = DocumentMetadata(
            filename=path.name,
            file_type=file_type,
            file_size=path.stat().st_size
        )
        
        return Document(content=content, metadata=metadata)
    
    def load_from_base64(
        self, 
        content: str, 
        filename: str, 
        file_type: DocumentType
    ) -> Document:
        """Load document from base64 encoded content."""
        try:
            decoded = base64.b64decode(content)
            
            if file_type == DocumentType.PDF:
                text_content = self._parse_pdf_bytes(decoded)
            else:
                text_content = decoded.decode("utf-8")
            
            metadata = DocumentMetadata(
                filename=filename,
                file_type=file_type,
                file_size=len(decoded)
            )
            
            return Document(content=text_content, metadata=metadata)
            
        except Exception as e:
            raise DocumentProcessingError(f"Failed to decode document: {e}")
    
    def _load_pdf(self, path: Path) -> str:
        """Extract text from PDF file."""
        try:
            import pypdf
            
            reader = pypdf.PdfReader(str(path))
            text_parts = []
            
            for page_num, page in enumerate(reader.pages, 1):
                text = page.extract_text()
                if text:
                    text_parts.append(f"[Page {page_num}]\n{text}")
            
            return "\n\n".join(text_parts)
            
        except ImportError:
            raise DocumentProcessingError("pypdf not installed")
        except Exception as e:
            raise DocumentProcessingError(f"Failed to parse PDF: {e}")
```

### Text Chunker

**src/ingestion/chunker.py**

```python
"""Text chunking utilities."""

from typing import List
import logging

from src.models.documents import Chunk
from config.settings import settings

logger = logging.getLogger(__name__)


class TextChunker:
    """
    Splits documents into overlapping chunks for embedding.
    
    Uses recursive splitting to respect document structure.
    """
    
    def __init__(
        self,
        chunk_size: int = None,
        chunk_overlap: int = None,
        separators: List[str] = None
    ):
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap
        self.separators = separators or ["\n\n", "\n", ". ", " ", ""]
    
    def chunk_document(self, document_id: str, text: str) -> List[Chunk]:
        """Split text into chunks."""
        if not text or not text.strip():
            return []
        
        text_chunks = self._recursive_split(text, self.separators)
        
        chunks = []
        current_pos = 0
        
        for i, chunk_text in enumerate(text_chunks):
            start_char = text.find(chunk_text, current_pos)
            if start_char == -1:
                start_char = current_pos
            end_char = start_char + len(chunk_text)
            
            chunk = Chunk(
                document_id=document_id,
                content=chunk_text,
                chunk_index=i,
                start_char=start_char,
                end_char=end_char
            )
            chunks.append(chunk)
            current_pos = max(current_pos, start_char + 1)
        
        logger.info(f"Created {len(chunks)} chunks from document {document_id}")
        return chunks
    
    def _recursive_split(self, text: str, separators: List[str]) -> List[str]:
        """Recursively split text using separators."""
        final_chunks = []
        separator = separators[0] if separators else ""
        remaining_separators = separators[1:] if len(separators) > 1 else []
        
        if separator:
            splits = text.split(separator)
        else:
            splits = list(text)
        
        current_chunk = []
        current_length = 0
        
        for split in splits:
            split_length = len(split)
            
            if current_length + split_length + len(separator) > self.chunk_size:
                if current_chunk:
                    chunk_text = separator.join(current_chunk)
                    
                    if len(chunk_text) > self.chunk_size and remaining_separators:
                        final_chunks.extend(
                            self._recursive_split(chunk_text, remaining_separators)
                        )
                    else:
                        final_chunks.append(chunk_text)
                    
                    overlap_chunks = self._get_overlap_chunks(current_chunk, separator)
                    current_chunk = overlap_chunks
                    current_length = sum(len(c) for c in current_chunk)
            
            current_chunk.append(split)
            current_length += split_length + len(separator)
        
        if current_chunk:
            chunk_text = separator.join(current_chunk)
            if len(chunk_text) > self.chunk_size and remaining_separators:
                final_chunks.extend(
                    self._recursive_split(chunk_text, remaining_separators)
                )
            else:
                final_chunks.append(chunk_text)
        
        return [c for c in final_chunks if c.strip()]
    
    def _get_overlap_chunks(self, chunks: List[str], separator: str) -> List[str]:
        """Get chunks that should be included for overlap."""
        if not self.chunk_overlap or not chunks:
            return []
        
        overlap_text = ""
        overlap_chunks = []
        
        for chunk in reversed(chunks):
            if len(overlap_text) + len(chunk) + len(separator) <= self.chunk_overlap:
                overlap_chunks.insert(0, chunk)
                overlap_text = separator.join(overlap_chunks)
            else:
                break
        
        return overlap_chunks
```

### Document Processor

**src/ingestion/processor.py**

```python
"""Document processing pipeline."""

import logging
from typing import List

from src.models.documents import (
    Document, 
    DocumentUploadRequest, 
    DocumentUploadResponse,
    DocumentStatus,
    Chunk
)
from src.ingestion.loader import DocumentLoader
from src.ingestion.chunker import TextChunker
from src.retrieval.embeddings import EmbeddingService
from src.retrieval.vector_store import VectorStore
from src.core.exceptions import DocumentProcessingError

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """
    Processes documents through the ingestion pipeline.
    
    Pipeline:
    1. Load document (parse if needed)
    2. Chunk into smaller pieces
    3. Generate embeddings
    4. Store in vector database
    """
    
    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_store: VectorStore
    ):
        self.loader = DocumentLoader()
        self.chunker = TextChunker()
        self.embedding_service = embedding_service
        self.vector_store = vector_store
    
    async def process(
        self, 
        request: DocumentUploadRequest
    ) -> DocumentUploadResponse:
        """Process a document upload request."""
        document = None
        
        try:
            # Step 1: Load document
            logger.info(f"Loading document: {request.filename}")
            document = self.loader.load_from_base64(
                content=request.content,
                filename=request.filename,
                file_type=request.file_type
            )
            document.status = DocumentStatus.PROCESSING
            
            # Step 2: Chunk document
            logger.info(f"Chunking document: {document.id}")
            chunks = self.chunker.chunk_document(
                document_id=document.id,
                text=document.content
            )
            
            if not chunks:
                raise DocumentProcessingError("No content to process")
            
            # Step 3: Generate embeddings
            logger.info(f"Generating embeddings for {len(chunks)} chunks")
            chunks_with_embeddings = await self._embed_chunks(chunks, document)
            
            # Step 4: Store in vector database
            logger.info(f"Storing chunks in vector database")
            await self.vector_store.add_chunks(chunks_with_embeddings)
            
            # Success
            document.status = DocumentStatus.INDEXED
            document.chunk_count = len(chunks)
            
            logger.info(
                f"Successfully processed document {document.id} "
                f"with {len(chunks)} chunks"
            )
            
            return DocumentUploadResponse(
                document_id=document.id,
                status=document.status,
                message="Document processed successfully",
                chunk_count=len(chunks)
            )
            
        except DocumentProcessingError as e:
            logger.error(f"Document processing error: {e}")
            if document:
                document.status = DocumentStatus.FAILED
                document.error_message = str(e)
            
            return DocumentUploadResponse(
                document_id=document.id if document else "",
                status=DocumentStatus.FAILED,
                message=f"Processing failed: {e}",
                chunk_count=0
            )
            
        except Exception as e:
            logger.exception(f"Unexpected error processing document: {e}")
            if document:
                document.status = DocumentStatus.FAILED
                document.error_message = str(e)
            
            return DocumentUploadResponse(
                document_id=document.id if document else "",
                status=DocumentStatus.FAILED,
                message=f"Unexpected error: {e}",
                chunk_count=0
            )
    
    async def _embed_chunks(
        self, 
        chunks: List[Chunk],
        document: Document
    ) -> List[Chunk]:
        """Generate embeddings for all chunks."""
        texts = [chunk.content for chunk in chunks]
        embeddings = await self.embedding_service.embed_batch(texts)
        
        for chunk, embedding in zip(chunks, embeddings):
            chunk.embedding = embedding
            chunk.metadata = {
                "document_id": document.id,
                "filename": document.metadata.filename,
                "file_type": document.metadata.file_type.value,
                "chunk_index": chunk.chunk_index
            }
        
        return chunks
```

---

## 7. Retrieval Layer

### Embedding Service

**src/retrieval/embeddings.py**

```python
"""Embedding generation service."""

import logging
from typing import List

from openai import AsyncOpenAI

from config.settings import settings
from src.core.exceptions import EmbeddingError

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for generating text embeddings."""
    
    MAX_BATCH_SIZE = 100
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.embedding_model
        self.dimensions = settings.embedding_dimensions
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        try:
            response = await self.client.embeddings.create(
                model=self.model,
                input=text,
                dimensions=self.dimensions
            )
            return response.data[0].embedding
            
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            raise EmbeddingError(f"Failed to generate embedding: {e}")
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of texts."""
        if not texts:
            return []
        
        try:
            all_embeddings = []
            
            for i in range(0, len(texts), self.MAX_BATCH_SIZE):
                batch = texts[i:i + self.MAX_BATCH_SIZE]
                
                response = await self.client.embeddings.create(
                    model=self.model,
                    input=batch,
                    dimensions=self.dimensions
                )
                
                sorted_data = sorted(response.data, key=lambda x: x.index)
                batch_embeddings = [item.embedding for item in sorted_data]
                all_embeddings.extend(batch_embeddings)
            
            return all_embeddings
            
        except Exception as e:
            logger.error(f"Batch embedding error: {e}")
            raise EmbeddingError(f"Failed to generate embeddings: {e}")
    
    async def health_check(self) -> bool:
        """Check if embedding service is healthy."""
        try:
            await self.embed_text("health check")
            return True
        except Exception:
            return False
```

### Vector Store

**src/retrieval/vector_store.py**

```python
"""Vector store operations using Qdrant."""

import logging
from typing import List, Optional

from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue
)

from config.settings import settings
from src.models.documents import Chunk
from src.core.exceptions import VectorStoreError

logger = logging.getLogger(__name__)


class VectorStore:
    """Vector store implementation using Qdrant."""
    
    def __init__(self):
        self.client = AsyncQdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port
        )
        self.collection_name = settings.qdrant_collection
        self.vector_size = settings.embedding_dimensions
        self._initialized = False
    
    async def initialize(self):
        """Initialize the vector store and create collection if needed."""
        if self._initialized:
            return
        
        try:
            collections = await self.client.get_collections()
            collection_names = [c.name for c in collections.collections]
            
            if self.collection_name not in collection_names:
                logger.info(f"Creating collection: {self.collection_name}")
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.vector_size,
                        distance=Distance.COSINE
                    )
                )
            
            self._initialized = True
            logger.info(f"Vector store initialized: {self.collection_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize vector store: {e}")
            raise VectorStoreError(f"Vector store initialization failed: {e}")
    
    async def add_chunks(self, chunks: List[Chunk]) -> int:
        """Add chunks to the vector store."""
        await self.initialize()
        
        if not chunks:
            return 0
        
        try:
            points = []
            for chunk in chunks:
                if chunk.embedding is None:
                    continue
                
                point = PointStruct(
                    id=chunk.id,
                    vector=chunk.embedding,
                    payload={
                        "document_id": chunk.document_id,
                        "content": chunk.content,
                        "chunk_index": chunk.chunk_index,
                        **chunk.metadata
                    }
                )
                points.append(point)
            
            if points:
                await self.client.upsert(
                    collection_name=self.collection_name,
                    points=points
                )
                logger.info(f"Added {len(points)} chunks to vector store")
            
            return len(points)
            
        except Exception as e:
            logger.error(f"Failed to add chunks: {e}")
            raise VectorStoreError(f"Failed to add chunks: {e}")
    
    async def search(
        self,
        embedding: List[float],
        top_k: int = 5,
        score_threshold: float = 0.0,
        filter_document_id: Optional[str] = None
    ) -> List[dict]:
        """Search for similar chunks."""
        await self.initialize()
        
        try:
            query_filter = None
            if filter_document_id:
                query_filter = Filter(
                    must=[
                        FieldCondition(
                            key="document_id",
                            match=MatchValue(value=filter_document_id)
                        )
                    ]
                )
            
            results = await self.client.search(
                collection_name=self.collection_name,
                query_vector=embedding,
                limit=top_k,
                score_threshold=score_threshold,
                query_filter=query_filter
            )
            
            chunks = []
            for result in results:
                chunk = {
                    "id": result.id,
                    "score": result.score,
                    "content": result.payload.get("content", ""),
                    "metadata": {
                        k: v for k, v in result.payload.items() 
                        if k != "content"
                    }
                }
                chunks.append(chunk)
            
            return chunks
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            raise VectorStoreError(f"Search failed: {e}")
    
    async def delete_document(self, document_id: str) -> int:
        """Delete all chunks for a document."""
        await self.initialize()
        
        try:
            result = await self.client.delete(
                collection_name=self.collection_name,
                points_selector=Filter(
                    must=[
                        FieldCondition(
                            key="document_id",
                            match=MatchValue(value=document_id)
                        )
                    ]
                )
            )
            logger.info(f"Deleted chunks for document: {document_id}")
            return result
            
        except Exception as e:
            raise VectorStoreError(f"Failed to delete document: {e}")
    
    async def get_stats(self) -> dict:
        """Get collection statistics."""
        await self.initialize()
        
        try:
            info = await self.client.get_collection(self.collection_name)
            return {
                "vectors_count": info.vectors_count,
                "points_count": info.points_count,
                "status": info.status.value
            }
        except Exception as e:
            return {"error": str(e)}
    
    async def ping(self) -> bool:
        """Check if vector store is reachable."""
        try:
            await self.client.get_collections()
            return True
        except Exception:
            return False
    
    async def close(self):
        """Close the client connection."""
        await self.client.close()
```

---

## 8. LLM Integration

### Base Provider Interface

**src/llm/providers/base.py**

```python
"""Base LLM provider interface."""

from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseLLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.0,
        max_tokens: int = 1024,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate a completion."""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """Check if provider is healthy."""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name."""
        pass
```

### Anthropic Provider

**src/llm/providers/anthropic.py**

```python
"""Anthropic (Claude) LLM provider."""

import logging
from typing import Dict, Any

from anthropic import AsyncAnthropic

from src.llm.providers.base import BaseLLMProvider
from config.settings import settings
from src.core.exceptions import LLMProviderError, LLMTimeoutError, LLMRateLimitError

logger = logging.getLogger(__name__)


class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude provider."""
    
    def __init__(self):
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        self.model = settings.llm_model
        self.timeout = settings.llm_timeout
    
    @property
    def name(self) -> str:
        return "anthropic"
    
    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = None,
        max_tokens: int = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using Claude."""
        temperature = temperature if temperature is not None else settings.llm_temperature
        max_tokens = max_tokens or settings.llm_max_tokens
        
        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}]
            )
            
            content = response.content[0].text
            tokens_used = response.usage.input_tokens + response.usage.output_tokens
            
            return {
                "content": content,
                "tokens_used": tokens_used,
                "model": self.model,
                "provider": self.name
            }
            
        except Exception as e:
            error_msg = str(e).lower()
            
            if "timeout" in error_msg:
                raise LLMTimeoutError(f"Request timed out: {e}")
            elif "rate" in error_msg and "limit" in error_msg:
                raise LLMRateLimitError(f"Rate limit exceeded: {e}")
            else:
                raise LLMProviderError(f"Anthropic API error: {e}")
    
    async def health_check(self) -> bool:
        """Check if Anthropic is accessible."""
        try:
            await self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "hi"}]
            )
            return True
        except Exception:
            return False
```

### OpenAI Provider

**src/llm/providers/openai.py**

```python
"""OpenAI LLM provider."""

import logging
from typing import Dict, Any

from openai import AsyncOpenAI

from src.llm.providers.base import BaseLLMProvider
from config.settings import settings
from src.core.exceptions import LLMProviderError, LLMTimeoutError, LLMRateLimitError

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseLLMProvider):
    """OpenAI GPT provider."""
    
    def __init__(self, model: str = "gpt-4o-mini"):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = model
    
    @property
    def name(self) -> str:
        return "openai"
    
    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = None,
        max_tokens: int = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion using GPT."""
        temperature = temperature if temperature is not None else settings.llm_temperature
        max_tokens = max_tokens or settings.llm_max_tokens
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                temperature=temperature,
                max_tokens=max_tokens,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
            return {
                "content": content,
                "tokens_used": tokens_used,
                "model": self.model,
                "provider": self.name
            }
            
        except Exception as e:
            error_msg = str(e).lower()
            
            if "timeout" in error_msg:
                raise LLMTimeoutError(f"Request timed out: {e}")
            elif "rate" in error_msg:
                raise LLMRateLimitError(f"Rate limit exceeded: {e}")
            else:
                raise LLMProviderError(f"OpenAI API error: {e}")
    
    async def health_check(self) -> bool:
        """Check if OpenAI is accessible."""
        try:
            await self.client.chat.completions.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "hi"}]
            )
            return True
        except Exception:
            return False
```

### LLM Gateway with Fallbacks

**src/llm/gateway.py**

```python
"""LLM Gateway with fallback support and circuit breaker."""

import logging
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

from src.llm.providers.base import BaseLLMProvider
from src.llm.providers.anthropic import AnthropicProvider
from src.llm.providers.openai import OpenAIProvider
from src.core.exceptions import LLMException, LLMProviderError, LLMRateLimitError
from config.settings import settings

logger = logging.getLogger(__name__)


class CircuitBreaker:
    """Simple circuit breaker implementation."""
    
    def __init__(self, failure_threshold: int = 3, recovery_time: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_time = recovery_time
        self.failures = 0
        self.last_failure: Optional[datetime] = None
        self.state = "closed"
    
    def record_failure(self):
        self.failures += 1
        self.last_failure = datetime.utcnow()
        if self.failures >= self.failure_threshold:
            self.state = "open"
    
    def record_success(self):
        self.failures = 0
        self.state = "closed"
    
    def can_execute(self) -> bool:
        if self.state == "closed":
            return True
        if self.state == "open" and self.last_failure:
            if datetime.utcnow() - self.last_failure > timedelta(seconds=self.recovery_time):
                self.state = "half-open"
                return True
        return self.state == "half-open"


class LLMGateway:
    """Gateway for LLM requests with fallback support."""
    
    def __init__(self):
        self.providers: Dict[str, BaseLLMProvider] = {}
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
        
        if settings.llm_provider.value == "anthropic":
            self.providers["anthropic"] = AnthropicProvider()
            self.providers["openai"] = OpenAIProvider()
            self.provider_order = ["anthropic", "openai"]
        else:
            self.providers["openai"] = OpenAIProvider()
            self.providers["anthropic"] = AnthropicProvider()
            self.provider_order = ["openai", "anthropic"]
        
        for name in self.providers:
            self.circuit_breakers[name] = CircuitBreaker()
    
    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = None,
        max_tokens: int = None,
        max_retries: int = 2,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion with automatic fallback."""
        last_error = None
        
        for provider_name in self.provider_order:
            provider = self.providers[provider_name]
            circuit_breaker = self.circuit_breakers[provider_name]
            
            if not circuit_breaker.can_execute():
                continue
            
            for attempt in range(max_retries):
                try:
                    result = await provider.complete(
                        system_prompt=system_prompt,
                        user_prompt=user_prompt,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        **kwargs
                    )
                    circuit_breaker.record_success()
                    return result
                    
                except LLMRateLimitError as e:
                    last_error = e
                    await asyncio.sleep(2 ** attempt)
                    
                except LLMProviderError as e:
                    last_error = e
                    circuit_breaker.record_failure()
                    break
                    
                except Exception as e:
                    last_error = e
                    circuit_breaker.record_failure()
                    break
        
        raise LLMException(f"All LLM providers failed. Last error: {last_error}")
    
    async def health_check(self) -> Dict[str, bool]:
        """Check health of all providers."""
        results = {}
        for name, provider in self.providers.items():
            results[name] = await provider.health_check()
        return results
```

---

## 9. Prompt Management

### Prompt Manager

**src/prompts/manager.py**

```python
"""Prompt template management with versioning."""

import logging
from pathlib import Path
from typing import Dict
from jinja2 import Template

from config.settings import settings
from src.core.exceptions import ConfigurationError

logger = logging.getLogger(__name__)


class PromptManager:
    """Manages prompt templates with versioning and caching."""
    
    def __init__(self, prompts_dir: str = None, version: str = None):
        self.prompts_dir = Path(prompts_dir or settings.prompts_dir)
        self.version = version or settings.prompt_version
        self.cache: Dict[str, str] = {}
    
    def get_prompt(self, name: str, version: str = None) -> str:
        """Get a prompt template by name."""
        version = version or self.version
        cache_key = f"{version}/{name}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        prompt_path = self.prompts_dir / version / f"{name}.txt"
        
        if not prompt_path.exists():
            raise ConfigurationError(f"Prompt not found: {prompt_path}")
        
        prompt = prompt_path.read_text(encoding="utf-8")
        self.cache[cache_key] = prompt
        
        return prompt
    
    def render_prompt(self, name: str, version: str = None, **kwargs) -> str:
        """Render a prompt template with variables."""
        template_str = self.get_prompt(name, version)
        template = Template(template_str)
        return template.render(**kwargs)
    
    def list_prompts(self, version: str = None) -> list:
        """List all available prompts for a version."""
        version = version or self.version
        version_dir = self.prompts_dir / version
        
        if not version_dir.exists():
            return []
        
        return [p.stem for p in version_dir.glob("*.txt")]
    
    def list_versions(self) -> list:
        """List all available prompt versions."""
        if not self.prompts_dir.exists():
            return []
        
        return [d.name for d in self.prompts_dir.iterdir() if d.is_dir()]
```

### Prompt Templates

**src/prompts/templates/v1/system.txt**

```
You are a helpful assistant that answers questions based on the provided context.

Rules:
1. ONLY answer based on the context provided below
2. If the answer is not in the context, say "I don't have information about that in the documents"
3. Always cite which document your answer comes from using [Source: filename]
4. Be concise but complete
5. If multiple documents contain relevant information, synthesize them
6. Do not make up or infer information not explicitly stated in the context
```

**src/prompts/templates/v1/query.txt**

```
Context:
{{ context }}

---

Question: {{ question }}

Please provide a helpful answer based only on the context above. Include citations to the source documents.
```

---

## 10. API Layer

### FastAPI Application

**src/api/main.py**

```python
"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import health, documents, query
from src.api.middleware.logging import LoggingMiddleware
from src.api.middleware.error_handler import error_handler_middleware
from src.core.orchestrator import Orchestrator
from config.settings import settings

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
        description="AI-powered document Q&A system",
        version="1.0.0",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.debug else [],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.middleware("http")(error_handler_middleware)
    app.add_middleware(LoggingMiddleware)
    
    app.include_router(health.router, prefix=f"{settings.api_prefix}/health", tags=["Health"])
    app.include_router(documents.router, prefix=f"{settings.api_prefix}/documents", tags=["Documents"])
    app.include_router(query.router, prefix=f"{settings.api_prefix}/query", tags=["Query"])
    
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.main:app", host=settings.api_host, port=settings.api_port, reload=settings.debug)
```

### Health Routes

**src/api/routes/health.py**

```python
"""Health check endpoints."""

from datetime import datetime
from fastapi import APIRouter

from src.models.common import HealthResponse
from src.core.orchestrator import Orchestrator

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
        components=health["components"]
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
```

### Query Routes

**src/api/routes/query.py**

```python
"""Query endpoints."""

import logging
from fastapi import APIRouter, HTTPException

from src.models.queries import QueryRequest, QueryResponse
from src.core.orchestrator import Orchestrator
from src.core.exceptions import DocuQueryException

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    """Ask a question about the documents."""
    try:
        orchestrator = Orchestrator.get_instance()
        response = await orchestrator.query(request)
        return response
        
    except DocuQueryException as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

### Document Routes

**src/api/routes/documents.py**

```python
"""Document management endpoints."""

import logging
from fastapi import APIRouter, HTTPException

from src.models.documents import DocumentUploadRequest, DocumentUploadResponse
from src.core.orchestrator import Orchestrator
from src.core.exceptions import DocumentException

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(request: DocumentUploadRequest):
    """Upload and process a document."""
    try:
        orchestrator = Orchestrator.get_instance()
        response = await orchestrator.ingest_document(request)
        return response
        
    except DocumentException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/stats")
async def get_stats():
    """Get document statistics."""
    orchestrator = Orchestrator.get_instance()
    return await orchestrator.vector_store.get_stats()


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete a document and its chunks."""
    try:
        orchestrator = Orchestrator.get_instance()
        await orchestrator.vector_store.delete_document(document_id)
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete document")
```

---

## 11. Middleware

### Logging Middleware

**src/api/middleware/logging.py**

```python
"""Request logging middleware."""

import time
import logging
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests with timing information."""
    
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        
        start_time = time.time()
        response = await call_next(request)
        duration_ms = int((time.time() - start_time) * 1000)
        
        logger.info(
            f"[{request_id}] {request.method} {request.url.path} "
            f"- {response.status_code} - {duration_ms}ms"
        )
        
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        
        return response
```

### Error Handler Middleware

**src/api/middleware/error_handler.py**

```python
"""Global error handling middleware."""

import logging
from datetime import datetime
from fastapi import Request
from fastapi.responses import JSONResponse

from src.models.common import ErrorResponse
from src.core.exceptions import DocuQueryException, ValidationError, DocumentNotFoundError

logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next):
    """Handle all uncaught exceptions."""
    try:
        return await call_next(request)
        
    except ValidationError as e:
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error="validation_error",
                message=e.message,
                detail=e.detail,
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None)
            ).model_dump(mode="json")
        )
        
    except DocumentNotFoundError as e:
        return JSONResponse(
            status_code=404,
            content=ErrorResponse(
                error="not_found",
                message=e.message,
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None)
            ).model_dump(mode="json")
        )
        
    except DocuQueryException as e:
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="application_error",
                message=e.message,
                detail=e.detail,
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None)
            ).model_dump(mode="json")
        )
        
    except Exception as e:
        logger.exception(f"Unhandled error: {e}")
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="internal_error",
                message="An unexpected error occurred",
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None)
            ).model_dump(mode="json")
        )
```

---

## 12. Docker Setup

### Dockerfile

**docker/Dockerfile**

```dockerfile
# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

RUN useradd --create-home --shell /bin/bash appuser

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache /wheels/*

COPY . .

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/live || exit 1

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

**docker/docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=dev
      - DEBUG=true
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
    env_file:
      - ../.env
    depends_on:
      qdrant:
        condition: service_healthy
    networks:
      - docuquery

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/readiness"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - docuquery

networks:
  docuquery:
    driver: bridge

volumes:
  qdrant_data:
```

---

## 13. Testing

### Pytest Configuration

**tests/conftest.py**

```python
"""Pytest fixtures and configuration."""

import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport

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
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def sample_document():
    """Sample document for testing."""
    return {
        "filename": "test_doc.md",
        "content": "VGhpcyBpcyBhIHRlc3QgZG9jdW1lbnQu",
        "file_type": "markdown"
    }
```

### Unit Tests Example

**tests/unit/test_chunker.py**

```python
"""Tests for text chunking."""

import pytest
from src.ingestion.chunker import TextChunker


class TestTextChunker:
    """Test cases for TextChunker."""
    
    def test_basic_chunking(self):
        """Test basic text chunking."""
        chunker = TextChunker(chunk_size=100, chunk_overlap=10)
        text = "This is a test document. " * 20
        
        chunks = chunker.chunk_document("doc-1", text)
        
        assert len(chunks) > 1
        assert all(len(c.content) <= 150 for c in chunks)
    
    def test_empty_text(self):
        """Test chunking empty text."""
        chunker = TextChunker()
        chunks = chunker.chunk_document("doc-1", "")
        
        assert chunks == []
    
    def test_small_text(self):
        """Test text smaller than chunk size."""
        chunker = TextChunker(chunk_size=1000)
        text = "Small text"
        
        chunks = chunker.chunk_document("doc-1", text)
        
        assert len(chunks) == 1
        assert chunks[0].content == text
```

### Integration Tests Example

**tests/integration/test_api.py**

```python
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
    async def test_query_validation(self, client: AsyncClient):
        """Test query validation."""
        response = await client.post(
            "/api/v1/query",
            json={"question": ""}
        )
        assert response.status_code == 422
```

---

## 14. CI/CD Pipeline

### GitHub Actions CI

**.github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install ruff black mypy
      
      - name: Run Ruff
        run: ruff check .
      
      - name: Run Black
        run: black --check .
      
      - name: Run MyPy
        run: mypy src/ --ignore-missing-imports

  test:
    runs-on: ubuntu-latest
    needs: lint
    
    services:
      qdrant:
        image: qdrant/qdrant:latest
        ports:
          - 6333:6333
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run tests
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          QDRANT_HOST: localhost
        run: pytest tests/ -v --cov=src

  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t docuquery:${{ github.sha }} -f docker/Dockerfile .
```

---

## 15. Running the Application

### Quick Start

```bash
# 1. Clone and setup
git clone <repo>
cd docuquery

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env with your API keys

# 5. Start Qdrant
docker run -p 6333:6333 qdrant/qdrant

# 6. Run the application
uvicorn src.api.main:app --reload
```

### Using Docker Compose

```bash
# Start everything
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop
docker-compose -f docker/docker-compose.yml down
```

### Using Makefile

```bash
make dev        # Install dev dependencies
make run        # Run application
make test       # Run tests
make lint       # Run linters
make docker-up  # Start Docker services
make docker-down # Stop Docker services
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/health/live` | GET | Liveness probe |
| `/api/v1/health/ready` | GET | Readiness probe |
| `/api/v1/documents/upload` | POST | Upload document |
| `/api/v1/documents/stats` | GET | Get statistics |
| `/api/v1/documents/{id}` | DELETE | Delete document |
| `/api/v1/query` | POST | Ask a question |

### Example API Calls

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Ask a question
curl -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the remote work policy?"}'

# Upload a document
curl -X POST http://localhost:8000/api/v1/documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "policy.md",
    "content": "base64_encoded_content",
    "file_type": "markdown"
  }'
```

---

## 16. Comparison: POC vs Development

| Aspect | POC (Stage 2) | Development (Stage 3) |
|--------|---------------|----------------------|
| **Files** | 1 file (~100 lines) | 30+ files (~2000+ lines) |
| **Vector DB** | Chroma (in-memory) | Qdrant (Docker) |
| **Error Handling** | None | Comprehensive |
| **Configuration** | Hardcoded | Environment-based |
| **API** | Streamlit UI | FastAPI REST API |
| **Testing** | Manual only | pytest (unit + integration) |
| **Logging** | print() | Structured logging |
| **Deployment** | `streamlit run` | Docker + docker-compose |
| **CI/CD** | None | GitHub Actions |
| **LLM** | Single provider | Gateway with fallbacks |
| **Prompts** | Inline strings | Versioned template files |

---

## 17. Exit Criteria

### Before Moving to Stage 4 (Staging)

**Code Quality**
- [ ] All modules follow project structure
- [ ] No hardcoded values (all in config)
- [ ] Comprehensive error handling
- [ ] Type hints throughout
- [ ] Docstrings on all public methods

**Testing**
- [ ] Unit test coverage >80%
- [ ] Integration tests pass
- [ ] All CI checks green

**Infrastructure**
- [ ] Docker builds successfully
- [ ] docker-compose runs full stack
- [ ] Health checks working

**Documentation**
- [ ] API documentation complete
- [ ] README with setup instructions
- [ ] Architecture diagram updated

**Functionality**
- [ ] Document upload works
- [ ] Query returns accurate answers
- [ ] Citations are correct
- [ ] Error messages are helpful

---

## 🚀 Next: Stage 4 — Staging Environment

Once development is complete, we move to staging which adds:
- Production-like infrastructure
- Full observability stack (Langfuse)
- Evaluation pipelines
- Security hardening
- Performance testing

[→ Continue to Stage 4: Staging](../stage-4-staging/README.md)

---

## Quick Reference

### Makefile Commands

```bash
make install     # Install production deps
make dev         # Install dev deps
make test        # Run tests
make test-cov    # Run tests with coverage
make lint        # Run linters
make format      # Format code
make docker-up   # Start Docker services
make docker-down # Stop Docker services
make run         # Run the application
make seed        # Load sample documents
make eval        # Run evaluation suite
make clean       # Clean up cache files
```

### Project Structure Summary

```
src/
├── api/          # FastAPI routes & middleware
├── core/         # Business logic & orchestration
├── ingestion/    # Document processing
├── retrieval/    # Vector search & embeddings
├── llm/          # LLM providers & gateway
├── prompts/      # Prompt templates
├── models/       # Pydantic data models
└── utils/        # Utilities

tests/
├── unit/         # Unit tests
├── integration/  # Integration tests
└── evals/        # Evaluation suite

config/           # Configuration files
docker/           # Docker files
scripts/          # Utility scripts
```