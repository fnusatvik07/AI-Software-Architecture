"""Document processing pipeline."""

import logging

from src.core.exceptions import DocumentProcessingError
from src.ingestion.chunker import TextChunker
from src.ingestion.loader import DocumentLoader
from src.models.documents import (
    Chunk,
    Document,
    DocumentStatus,
    DocumentUploadRequest,
    DocumentUploadResponse,
)
from src.retrieval.embeddings import EmbeddingService
from src.retrieval.vector_store import VectorStore

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

    def __init__(self, embedding_service: EmbeddingService, vector_store: VectorStore):
        self.loader = DocumentLoader()
        self.chunker = TextChunker()
        self.embedding_service = embedding_service
        self.vector_store = vector_store

    async def process(self, request: DocumentUploadRequest) -> DocumentUploadResponse:
        """Process a document upload request."""
        document = None

        try:
            # Step 1: Load document
            logger.info(f"Loading document: {request.filename}")
            document = self.loader.load_from_base64(
                content=request.content,
                filename=request.filename,
                file_type=request.file_type,
            )
            document.status = DocumentStatus.PROCESSING

            # Step 2: Chunk document
            logger.info(f"Chunking document: {document.id}")
            chunks = self.chunker.chunk_document(
                document_id=document.id, text=document.content
            )

            if not chunks:
                raise DocumentProcessingError("No content to process")

            # Step 3: Generate embeddings
            logger.info(f"Generating embeddings for {len(chunks)} chunks")
            chunks_with_embeddings = await self._embed_chunks(chunks, document)

            # Step 4: Store in vector database
            logger.info("Storing chunks in vector database")
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
                chunk_count=len(chunks),
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
                chunk_count=0,
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
                chunk_count=0,
            )

    async def _embed_chunks(
        self, chunks: list[Chunk], document: Document
    ) -> list[Chunk]:
        """Generate embeddings for all chunks."""
        texts = [chunk.content for chunk in chunks]
        embeddings = await self.embedding_service.embed_batch(texts)

        for chunk, embedding in zip(chunks, embeddings, strict=False):
            chunk.embedding = embedding
            chunk.metadata = {
                "document_id": document.id,
                "filename": document.metadata.filename,
                "file_type": document.metadata.file_type.value,
                "chunk_index": chunk.chunk_index,
            }

        return chunks
