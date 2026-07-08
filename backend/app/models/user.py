"""User domain model (email + hashed password, for the future accounts/dashboard feature)."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    user_id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    plan: str = "free"  # free | pro
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        return self.model_dump()
