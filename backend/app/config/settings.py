"""
Centralized application configuration.
Reads from environment variables / .env with production-safe defaults.
Never hardcode secrets in code -- override JWT_SECRET_KEY and MONGO_URI in production.
"""
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "PDFTool API"
    APP_ENV: str = "development"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    APP_VERSION: str = "1.0.0"

    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "pdftool"

    JWT_SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7

    MAX_UPLOAD_SIZE_MB: int = 50
    TEMP_DIR: str = "/tmp/pdftool"
    FILE_TTL_SECONDS: int = 60 * 30

    RATE_LIMIT_REQUESTS: int = 30
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    SOFFICE_BIN: str = "soffice"
    SOFFICE_TIMEOUT_SECONDS: int = 90

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def temp_dir_path(self) -> Path:
        p = Path(self.TEMP_DIR)
        p.mkdir(parents=True, exist_ok=True)
        return p


@lru_cache
def get_settings() -> Settings:
    return Settings()
