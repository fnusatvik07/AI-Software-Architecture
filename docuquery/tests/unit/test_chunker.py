"""Tests for text chunking."""

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

    def test_whitespace_only(self):
        """Test chunking whitespace-only text."""
        chunker = TextChunker()
        chunks = chunker.chunk_document("doc-1", "   \n\n   ")

        assert chunks == []

    def test_small_text(self):
        """Test text smaller than chunk size."""
        chunker = TextChunker(chunk_size=1000)
        text = "Small text"

        chunks = chunker.chunk_document("doc-1", text)

        assert len(chunks) == 1
        assert chunks[0].content == text

    def test_chunk_metadata(self):
        """Test chunk metadata is correctly set."""
        chunker = TextChunker(chunk_size=50)
        text = "This is a test document with some content."

        chunks = chunker.chunk_document("doc-123", text)

        for i, chunk in enumerate(chunks):
            assert chunk.document_id == "doc-123"
            assert chunk.chunk_index == i
            assert chunk.start_char >= 0
            assert chunk.end_char > chunk.start_char
