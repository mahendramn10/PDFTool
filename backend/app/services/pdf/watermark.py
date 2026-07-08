"""Watermark service -- stamps semi-transparent diagonal (or positioned) text on every page."""
import math
from pathlib import Path

import fitz

from app.services.pdf.exceptions import PDFProcessingError

_POSITION_Y_FACTOR = {"top": 0.15, "center": 0.5, "bottom": 0.85}


def add_watermark(
    input_path: Path,
    output_path: Path,
    text: str,
    opacity: float = 0.3,
    font_size: int = 40,
    rotation: int = 45,
    position: str = "center",
) -> Path:
    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        y_factor = _POSITION_Y_FACTOR.get(position, 0.5)
        for page in doc:
            rect = page.rect
            text_len = fitz.get_text_length(text, fontname="helv", fontsize=font_size)
            x = (rect.width - text_len) / 2
            y = rect.height * y_factor

            shape = page.new_shape()
            morph_center = fitz.Point(rect.width / 2, y)
            shape.insert_text(
                fitz.Point(x, y),
                text,
                fontname="helv",
                fontsize=font_size,
                color=(0.5, 0.5, 0.5),
                fill_opacity=opacity,
                morph=(morph_center, fitz.Matrix(rotation)),
            )
            shape.commit()
        doc.save(output_path, garbage=4, deflate=True)
    finally:
        doc.close()

    return output_path
