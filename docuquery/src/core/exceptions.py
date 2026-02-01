"""Custom exceptions for the application."""


class DocuQueryException(Exception):
    """Base exception for all application errors."""

    def __init__(self, message: str, detail: str | None = None):
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
