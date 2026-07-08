"""
Compress PDF service.

Strategy: PyMuPDF's own garbage-collection + stream deflation handles
structural bloat for free. For real size wins we additionally recompress
embedded raster images with Pillow at a quality tuned by the requested
preset -- this is CPU-light (no external binaries) and works well on
scanned/image-heavy PDFs, which are the dominant cause of PDF bloat.
"""
import io
from pathlib import Path

import fitz
from PIL import Image

from app.services.pdf.exceptions import PDFProcessingError

_QUALITY_PRESETS = {
    "low": {"jpeg_quality": 40, "max_dimension": 1000},        # smallest file, most lossy
    "recommended": {"jpeg_quality": 60, "max_dimension": 1400},
    "high": {"jpeg_quality": 80, "max_dimension": 2000},        # largest file, best fidelity
}


def compress_pdf(input_path: Path, output_path: Path, quality: str = "recommended") -> Path:
    preset = _QUALITY_PRESETS.get(quality, _QUALITY_PRESETS["recommended"])

    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        for page in doc:
            for img_info in page.get_images(full=True):
                xref = img_info[0]
                try:
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

                    w, h = pil_image.size
                    max_dim = preset["max_dimension"]
                    if max(w, h) > max_dim:
                        scale = max_dim / max(w, h)
                        pil_image = pil_image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

                    buf = io.BytesIO()
                    pil_image.save(buf, format="JPEG", quality=preset["jpeg_quality"], optimize=True)
                    doc.update_stream(xref, buf.getvalue())
                except Exception:
                    continue  # skip images that fail to re-encode; never fail the whole job over one image

        doc.save(output_path, garbage=4, deflate=True, clean=True)
    finally:
        doc.close()

    return output_path
