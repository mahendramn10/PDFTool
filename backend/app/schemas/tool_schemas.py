"""Request DTOs for tool endpoints that take structured (non-file) parameters."""
from typing import List, Optional

from pydantic import BaseModel, Field


class PageRangeRequest(BaseModel):
    pages: str = Field(..., description="Comma/range page spec, e.g. '1,3,5-8'")


class RearrangeRequest(BaseModel):
    order: List[int] = Field(..., description="New 1-indexed page order, e.g. [3,1,2]")


class RotateRequest(BaseModel):
    angle: int = Field(..., description="Rotation angle: 90, 180, or 270")
    pages: Optional[str] = Field(None, description="Optional page spec; rotates all pages if omitted")


class WatermarkRequest(BaseModel):
    text: str = Field(..., max_length=200)
    opacity: float = Field(0.3, ge=0.05, le=1.0)
    font_size: int = Field(40, ge=8, le=200)
    rotation: int = Field(45, ge=0, le=360)
    position: str = Field("center", pattern="^(center|top|bottom)$")


class PageNumberRequest(BaseModel):
    position: str = Field("bottom-center", pattern="^(bottom-center|bottom-right|bottom-left|top-center|top-right|top-left)$")
    start_number: int = Field(1, ge=1)
    font_size: int = Field(11, ge=6, le=48)


class CompressRequest(BaseModel):
    quality: str = Field("recommended", pattern="^(low|recommended|high)$")
