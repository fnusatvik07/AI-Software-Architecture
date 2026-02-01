"""Global error handling middleware."""

import logging
from datetime import datetime

from fastapi import Request
from fastapi.responses import JSONResponse

from src.core.exceptions import (
    DocumentNotFoundError,
    DocuQueryException,
    ValidationError,
)
from src.models.common import ErrorResponse

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
                request_id=getattr(request.state, "request_id", None),
            ).model_dump(mode="json"),
        )

    except DocumentNotFoundError as e:
        return JSONResponse(
            status_code=404,
            content=ErrorResponse(
                error="not_found",
                message=e.message,
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None),
            ).model_dump(mode="json"),
        )

    except DocuQueryException as e:
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="application_error",
                message=e.message,
                detail=e.detail,
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None),
            ).model_dump(mode="json"),
        )

    except Exception as e:
        logger.exception(f"Unhandled error: {e}")
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="internal_error",
                message="An unexpected error occurred",
                timestamp=datetime.utcnow(),
                request_id=getattr(request.state, "request_id", None),
            ).model_dump(mode="json"),
        )
