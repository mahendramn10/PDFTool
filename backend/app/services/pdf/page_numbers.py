"""Page numbers service -- stamps sequential page numbers at a chosen corner/edge of every page."""
from pathlib import Path

import fitz

from app.services.pdf.exceptions import PDFProcessingError

_MARGIN = 24


def _position_point(rect: fitz.Rect, position: str, text_width: float) -> fitz.Point:
    if position.startswith("bottom"):
        y = rect.height - _MARGIN
    else:
        y = _MARGIN + 10

    if position.endswith("left"):
        x = _MARGIN
    elif position.endswith("right"):
        x = rect.width - _MARGIN - text_width
    else:  # center
        x = (rect.width - text_width) / 2

    return fitz.Point(x, y)


def add_page_numbers(
    input_path: Path,
    output_path: Path,
    position: str = "bottom-center",
    start_number: int = 1,
    font_size: int = 11,
) -> Path:
    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        for i, page in enumerate(doc):
            number = start_number + i
            text = str(number)
            text_width = fitz.get_text_length(text, fontname="helv", fontsize=font_size)
            point = _position_point(page.rect, position, text_width)
            page.insert_text(point, text, fontname="helv", fontsize=font_size, color=(0, 0, 0))
        doc.save(output_path, garbage=4, deflate=True)
    finally:
        doc.close()

    return output_path
