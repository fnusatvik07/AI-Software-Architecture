"""Vector store operations using Qdrant."""

import logging

from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from config.settings import settings
from src.core.exceptions import VectorStoreError
from src.models.documents import Chunk

logger = logging.getLogger(__name__)


class VectorStore:
    """Vector store implementation using Qdrant."""

    def __init__(self, in_memory: bool = True):
        # Use in-memory mode for development (no Docker needed)
        if in_memory:
            self.client = AsyncQdrantClient(":memory:")
        else:
            self.client = AsyncQdrantClient(
                host=settings.qdrant_host, port=settings.qdrant_port
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
                        size=self.vector_size, distance=Distance.COSINE
                    ),
                )

            self._initialized = True
            logger.info(f"Vector store initialized: {self.collection_name}")

        except Exception as e:
            logger.error(f"Failed to initialize vector store: {e}")
            raise VectorStoreError(f"Vector store initialization failed: {e}")

    async def add_chunks(self, chunks: list[Chunk]) -> int:
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
                        **chunk.metadata,
                    },
                )
                points.append(point)

            if points:
                await self.client.upsert(
                    collection_name=self.collection_name, points=points
                )
                logger.info(f"Added {len(points)} chunks to vector store")

            return len(points)

        except Exception as e:
            logger.error(f"Failed to add chunks: {e}")
            raise VectorStoreError(f"Failed to add chunks: {e}")

    async def search(
        self,
        embedding: list[float],
        top_k: int = 5,
        score_threshold: float = 0.0,
        filter_document_id: str | None = None,
    ) -> list[dict]:
        """Search for similar chunks."""
        await self.initialize()

        try:
            query_filter = None
            if filter_document_id:
                query_filter = Filter(
                    must=[
                        FieldCondition(
                            key="document_id",
                            match=MatchValue(value=filter_document_id),
                        )
                    ]
                )

            results = await self.client.query_points(
                collection_name=self.collection_name,
                query=embedding,
                limit=top_k,
                score_threshold=score_threshold,
                query_filter=query_filter,
            )

            chunks = []
            for result in results.points:
                chunk = {
                    "id": result.id,
                    "score": result.score,
                    "content": result.payload.get("content", ""),
                    "metadata": {
                        k: v for k, v in result.payload.items() if k != "content"
                    },
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
                            key="document_id", match=MatchValue(value=document_id)
                        )
                    ]
                ),
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
                "status": info.status.value,
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
