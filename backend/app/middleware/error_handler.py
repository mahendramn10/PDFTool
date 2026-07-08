"""Global exception handlers so no stack trace or internal path ever reaches the client."""
import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.utils.responses import error_response

logger = logging.getLogger("pdftool")


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return error_response(message=str(exc.detail), status_code=exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return error_response(
            message="Invalid request data.",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            errors=exc.errors(),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
        return error_response(
            message="An unexpected error occurred. Please try again.",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
