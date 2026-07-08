"""Rotate PDF service -- rotates all pages, or a specified subset, by a fixed angle."""
from pathlib import Path
from typing import Optional

import fitz

from app.services.pdf.exceptions import PDFProcessingError
from app.utils.page_ranges import parse_page_spec


def rotate_pdf(input_path: Path, output_path: Path, angle: int, pages_spec: Optional[str] = None) -> Path:
    if angle not in (90, 180, 270):
        raise PDFProcessingError("Rotation angle must be 90, 180, or 270 degrees.")

    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        target_pages = parse_page_spec(pages_spec, doc.page_count) if pages_spec else range(doc.page_count)
        for i in target_pages:
            page = doc[i]
            page.set_rotation((page.rotation + angle) % 360)
        doc.save(output_path, garbage=4, deflate=True)
    finally:
        doc.close()

    return output_path
