"""Tests for embedding service."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest


class TestEmbeddingService:
    """Test cases for EmbeddingService."""

    @pytest.mark.asyncio
    async def test_embed_text_success(self):
        """Test successful single text embedding."""
        with patch("src.retrieval.embeddings.AsyncOpenAI") as mock_openai:
            # Setup mock
            mock_client = MagicMock()
            mock_response = MagicMock()
            mock_response.data = [MagicMock(embedding=[0.1] * 3072)]
            mock_client.embeddings.create = AsyncMock(return_value=mock_response)
            mock_openai.return_value = mock_client

            from src.retrieval.embeddings import EmbeddingService

            service = EmbeddingService()
            service.client = mock_client

            result = await service.embed_text("test text")

            assert len(result) == 3072
            assert result[0] == 0.1

    @pytest.mark.asyncio
    async def test_embed_batch_empty(self):
        """Test batch embedding with empty list."""
        with patch("src.retrieval.embeddings.AsyncOpenAI") as mock_openai:
            mock_client = MagicMock()
            mock_openai.return_value = mock_client

            from src.retrieval.embeddings import EmbeddingService

            service = EmbeddingService()

            result = await service.embed_batch([])

            assert result == []
