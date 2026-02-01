"""Text chunking utilities."""

import logging

from config.settings import settings
from src.models.documents import Chunk

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
        separators: list[str] = None,
    ):
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap
        self.separators = separators or ["\n\n", "\n", ". ", " ", ""]

    def chunk_document(self, document_id: str, text: str) -> list[Chunk]:
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
                end_char=end_char,
            )
            chunks.append(chunk)
            current_pos = max(current_pos, start_char + 1)

        logger.info(f"Created {len(chunks)} chunks from document {document_id}")
        return chunks

    def _recursive_split(self, text: str, separators: list[str]) -> list[str]:
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

    def _get_overlap_chunks(self, chunks: list[str], separator: str) -> list[str]:
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
