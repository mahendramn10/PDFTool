"""Domain model for a processing job (one tool invocation), persisted for history/analytics."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, Field

from app.config.constants import JOB_STATUS_PENDING


class Job(BaseModel):
    job_id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    tool: str
    status: str = JOB_STATUS_PENDING
    input_filenames: list = Field(default_factory=list)
    output_filename: Optional[str] = None
    error_message: Optional[str] = None
    meta: dict = Field(default_factory=dict)
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

    def to_mongo(self) -> dict:
        return self.model_dump()
