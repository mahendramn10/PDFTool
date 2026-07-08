"""Health check endpoint used by Render/uptime monitors and the rate limiter's own bypass list."""
from fastapi import APIRouter

from app.config.settings import get_settings
from app.database.mongodb import mongodb

router = APIRouter(tags=["Health"])
settings = get_settings()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected" if mongodb.is_connected else "unavailable",
    }
