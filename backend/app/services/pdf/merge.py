"""Merge PDF service -- combines multiple PDFs (in the given order) into one document."""
from pathlib import Path
from typing import List

import fitz  # PyMuPDF

from app.services.pdf.exceptions import PDFProcessingError


def merge_pdfs(input_paths: List[Path], output_path: Path) -> Path:
    if len(input_paths) < 2:
        raise PDFProcessingError("At least two PDF files are required to merge.")

    merged = fitz.open()
    try:
        for path in input_paths:
            try:
                with fitz.open(path) as src:
                    merged.insert_pdf(src)
            except Exception as exc:
                raise PDFProcessingError(f"Could not read '{path.name}': it may be corrupted or password protected.") from exc
        merged.save(output_path, garbage=4, deflate=True)
    finally:
        merged.close()
    return output_path
