"""
File handling utilities.

Security notes:
- `sanitize_filename` strips path separators and traversal sequences so a
  malicious filename like `../../etc/passwd` can never escape the temp dir.
- `validate_upload` enforces extension allow-lists BEFORE any bytes are persisted.
- All working files live under a per-request UUID subdirectory of TEMP_DIR
  and are deleted by `cleanup_paths` in a `finally` block by the caller.
"""
from __future__ import annotations

import re
import shutil
import time
import uuid
from pathlib import Path
from typing import Iterable, Optional

from fastapi import UploadFile, HTTPException, status

from app.config.constants import ALLOWED_UPLOAD_EXTENSIONS
from app.config.settings import get_settings

settings = get_settings()

_FILENAME_SAFE_RE = re.compile(r"[^A-Za-z0-9._-]+")


def sanitize_filename(filename: str) -> str:
    """Return a filesystem-safe filename with no directory components."""
    name = Path(filename).name
    name = name.replace("..", "")
    stem, suffix = Path(name).stem, Path(name).suffix
    stem = _FILENAME_SAFE_RE.sub("_", stem).strip("_") or "file"
    suffix = _FILENAME_SAFE_RE.sub("", suffix)
    return f"{stem}{suffix}"


def get_extension(filename: str) -> str:
    return Path(filename).suffix.lower()


def validate_upload(file: UploadFile, allowed_extensions: Optional[Iterable[str]] = None) -> str:
    allowed = set(allowed_extensions) if allowed_extensions is not None else ALLOWED_UPLOAD_EXTENSIONS
    filename = sanitize_filename(file.filename or "upload")
    ext = get_extension(filename)
    if ext not in allowed:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"File type '{ext}' is not supported. Allowed: {', '.join(sorted(allowed))}",
        )
    return filename


def new_job_dir() -> Path:
    job_dir = settings.temp_dir_path / uuid.uuid4().hex
    job_dir.mkdir(parents=True, exist_ok=True)
    return job_dir


async def save_upload(file: UploadFile, destination_dir: Path, allowed_extensions: Optional[Iterable[str]] = None) -> Path:
    """Validate and persist an UploadFile to destination_dir, enforcing size limit while streaming."""
    filename = validate_upload(file, allowed_extensions)
    dest_path = destination_dir / filename

    size = 0
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    with open(dest_path, "wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > max_bytes:
                out.close()
                dest_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds the {settings.MAX_UPLOAD_SIZE_MB}MB limit.",
                )
            out.write(chunk)
    await file.seek(0)
    return dest_path


def cleanup_paths(*paths: Optional[Path]) -> None:
    """Best-effort recursive cleanup of files/directories. Never raises."""
    for p in paths:
        try:
            if p is None:
                continue
            if p.is_dir():
                shutil.rmtree(p, ignore_errors=True)
            elif p.exists():
                p.unlink(missing_ok=True)
        except Exception:
            pass


def purge_stale_temp_files() -> int:
    """Remove job directories older than FILE_TTL_SECONDS. Called periodically by a background task."""
    now = time.time()
    removed = 0
    root = settings.temp_dir_path
    if not root.exists():
        return 0
    for entry in root.iterdir():
        try:
            if entry.is_dir() and (now - entry.stat().st_mtime) > settings.FILE_TTL_SECONDS:
                shutil.rmtree(entry, ignore_errors=True)
                removed += 1
        except Exception:
            continue
    return removed
