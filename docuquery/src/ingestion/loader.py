"""Document loading utilities."""

import base64
import logging
from pathlib import Path

from src.core.exceptions import DocumentProcessingError
from src.models.documents import Document, DocumentMetadata, DocumentType

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

    def load_from_file(self, file_path: str | Path) -> Document:
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
            filename=path.name, file_type=file_type, file_size=path.stat().st_size
        )

        return Document(content=content, metadata=metadata)

    def load_from_base64(
        self, content: str, filename: str, file_type: DocumentType
    ) -> Document:
        """Load document from base64 encoded content or plain text."""
        try:
            # Try base64 decode first, fall back to plain text
            try:
                decoded = base64.b64decode(content)
                if file_type == DocumentType.PDF:
                    text_content = self._parse_pdf_bytes(decoded)
                else:
                    text_content = decoded.decode("utf-8")
                file_size = len(decoded)
            except Exception:
                # Content is already plain text
                text_content = content
                file_size = len(content.encode("utf-8"))

            metadata = DocumentMetadata(
                filename=filename, file_type=file_type, file_size=file_size
            )

            return Document(content=text_content, metadata=metadata)

        except Exception as e:
            raise DocumentProcessingError(f"Failed to process document: {e}") from e

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

        except ImportError as e:
            raise DocumentProcessingError("pypdf not installed") from e
        except Exception as e:
            raise DocumentProcessingError(f"Failed to parse PDF: {e}") from e

    def _parse_pdf_bytes(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF bytes."""
        try:
            from io import BytesIO

            import pypdf

            reader = pypdf.PdfReader(BytesIO(pdf_bytes))
            text_parts = []

            for page_num, page in enumerate(reader.pages, 1):
                text = page.extract_text()
                if text:
                    text_parts.append(f"[Page {page_num}]\n{text}")

            return "\n\n".join(text_parts)

        except ImportError as e:
            raise DocumentProcessingError("pypdf not installed") from e
        except Exception as e:
            raise DocumentProcessingError(f"Failed to parse PDF: {e}") from e
