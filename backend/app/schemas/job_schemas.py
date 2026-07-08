"""API-facing DTOs for job status responses."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class JobStatusResponse(BaseModel):
    job_id: str
    tool: str
    status: str
    output_filename: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
