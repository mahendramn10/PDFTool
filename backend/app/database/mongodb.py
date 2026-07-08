"""
MongoDB connection lifecycle, managed via Motor (async driver).
The API remains fully functional (tools still work) even if Mongo is
unreachable -- persistence is for job history/analytics only, never a
hard dependency for the core PDF processing path.
"""
import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config.settings import get_settings

logger = logging.getLogger("pdftool.db")
settings = get_settings()


class MongoDB:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    async def connect(self) -> None:
        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[settings.MONGO_DB_NAME]
            await self.client.admin.command("ping")
            await self._ensure_indexes()
            logger.info("Connected to MongoDB database '%s'", settings.MONGO_DB_NAME)
        except Exception as exc:
            logger.warning("MongoDB unavailable, continuing without persistence: %s", exc)
            self.client = None
            self.db = None

    async def disconnect(self) -> None:
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    async def _ensure_indexes(self) -> None:
        if self.db is None:
            return
        await self.db["jobs"].create_index("job_id", unique=True)
        await self.db["jobs"].create_index("created_at", expireAfterSeconds=60 * 60 * 24 * 7)
        await self.db["users"].create_index("email", unique=True)

    @property
    def is_connected(self) -> bool:
        return self.db is not None


mongodb = MongoDB()
