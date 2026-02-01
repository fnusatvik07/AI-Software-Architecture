"""Embedding generation service."""

import logging

from openai import AsyncOpenAI

from config.settings import settings
from src.core.exceptions import EmbeddingError

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for generating text embeddings using OpenAI."""

    MAX_BATCH_SIZE = 100

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.embedding_model
        self.dimensions = settings.embedding_dimensions

    async def embed_text(self, text: str) -> list[float]:
        """Generate embedding for a single text."""
        try:
            response = await self.client.embeddings.create(
                model=self.model, input=text, dimensions=self.dimensions
            )
            return response.data[0].embedding

        except Exception as e:
            logger.error(f"Embedding error: {e}")
            raise EmbeddingError(f"Failed to generate embedding: {e}")

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a batch of texts."""
        if not texts:
            return []

        try:
            all_embeddings = []

            for i in range(0, len(texts), self.MAX_BATCH_SIZE):
                batch = texts[i : i + self.MAX_BATCH_SIZE]

                response = await self.client.embeddings.create(
                    model=self.model, input=batch, dimensions=self.dimensions
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
