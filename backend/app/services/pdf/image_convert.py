"""
Image <-> PDF conversion service.
Uses only PyMuPDF (rasterization) and Pillow (image I/O) -- no paid APIs,
no heavyweight rendering engines. Rasterization at 200 DPI balances quality
and file size/CPU cost for typical documents.
"""
import zipfile
from pathlib import Path
from typing import List

import fitz
from PIL import Image

from app.services.pdf.exceptions import PDFProcessingError

_DPI = 200
_ZOOM = _DPI / 72  # PDF base unit is 72 DPI


def pdf_to_images(input_path: Path, output_dir: Path, output_zip_path: Path, fmt: str = "jpg") -> Path:
    """Rasterize every page of a PDF to an image and zip the results."""
    fmt = fmt.lower()
    if fmt not in ("jpg", "jpeg", "png"):
        raise PDFProcessingError("Unsupported image format requested.")
    pillow_fmt = "JPEG" if fmt in ("jpg", "jpeg") else "PNG"
    ext = "jpg" if pillow_fmt == "JPEG" else "png"

    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        matrix = fitz.Matrix(_ZOOM, _ZOOM)
        stem = input_path.stem
        image_paths = []
        for i, page in enumerate(doc):
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            img_path = output_dir / f"{stem}_page_{i + 1}.{ext}"
            if pillow_fmt == "JPEG":
                pil_img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
                pil_img.save(img_path, format="JPEG", quality=90)
            else:
                pix.save(img_path)
            image_paths.append(img_path)

        with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for p in image_paths:
                zf.write(p, arcname=p.name)
    finally:
        doc.close()

    return output_zip_path


def images_to_pdf(input_paths: List[Path], output_path: Path) -> Path:
    """Combine one or more JPG/PNG images (in order) into a single PDF, one image per page."""
    if not input_paths:
        raise PDFProcessingError("At least one image is required.")

    converted = []
    for path in input_paths:
        try:
            img = Image.open(path)
            if img.mode != "RGB":
                img = img.convert("RGB")
            converted.append(img)
        except Exception as exc:
            raise PDFProcessingError(f"Could not read image '{path.name}'.") from exc

    first, rest = converted[0], converted[1:]
    first.save(output_path, format="PDF", save_all=True, append_images=rest)
    return output_path
