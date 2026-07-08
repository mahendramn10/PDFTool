"""
Lightweight in-memory sliding-window rate limiter.

Production note: process-local memory is fine for a single Render instance.
When scaling horizontally, swap `_hits` for a Redis sorted-set
(ZADD/ZREMRANGEBYSCORE) -- the interface below is intentionally small so
that swap only touches this file.
"""
import time
from collections import defaultdict, deque
from typing import Deque, Dict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config.settings import get_settings

settings = get_settings()


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next):
        if request.url.path in ("/", "/health", f"{settings.API_V1_PREFIX}/health"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = settings.RATE_LIMIT_WINDOW_SECONDS
        bucket = self._hits[client_ip]

        while bucket and now - bucket[0] > window:
            bucket.popleft()

        if len(bucket) >= settings.RATE_LIMIT_REQUESTS:
            return JSONResponse(
                status_code=429,
                content={"success": False, "message": "Too many requests. Please slow down and try again shortly."},
            )

        bucket.append(now)
        return await call_next(request)
