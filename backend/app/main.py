"""
PDFTool API -- application entrypoint.

Clean architecture layering:
  routers/    -> presentation/API layer (HTTP concerns only)
  services/   -> business logic (pure functions, framework-agnostic)
  database/   -> data layer (Mongo connection lifecycle)
  models/     -> domain entities
  schemas/    -> API request/response DTOs
  middleware/ -> cross-cutting concerns (rate limiting, logging, errors)
  utils/      -> shared helpers (file handling, page-range parsing)
  config/     -> settings & constants
"""
import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.database.mongodb import mongodb
from app.middleware.error_handler import register_error_handlers
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.rate_limiter import RateLimitMiddleware
from app.routers import health, image_tools, office_tools, pdf_tools
from app.utils.file_utils import purge_stale_temp_files

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("pdftool")

settings = get_settings()


async def _temp_file_janitor():
    """Background loop that purges stale per-request temp directories every 5 minutes."""
    while True:
        try:
            removed = purge_stale_temp_files()
            if removed:
                logger.info("Janitor: purged %d stale temp job directories", removed)
        except Exception as exc:
            logger.warning("Janitor loop error: %s", exc)
        await asyncio.sleep(300)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongodb.connect()
    janitor_task = asyncio.create_task(_temp_file_janitor())
    logger.info("%s v%s started in '%s' mode", settings.APP_NAME, settings.APP_VERSION, settings.APP_ENV)
    yield
    janitor_task.cancel()
    await mongodb.disconnect()
    logger.info("%s shut down cleanly", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Fast, Secure & Free PDF Tools -- production API for PDFTool.",
    docs_url="/api/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/api/redoc" if settings.APP_ENV != "production" else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)

register_error_handlers(app)

app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(pdf_tools.router, prefix=settings.API_V1_PREFIX)
app.include_router(image_tools.router, prefix=settings.API_V1_PREFIX)
app.include_router(office_tools.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {"service": settings.APP_NAME, "status": "running", "docs": "/api/docs"}
