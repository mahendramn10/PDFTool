"""Split PDF service -- splits a single PDF into individual page PDFs, zipped together."""
import zipfile
from pathlib import Path

import fitz

from app.services.pdf.exceptions import PDFProcessingError


def split_pdf(input_path: Path, output_dir: Path, output_zip_path: Path) -> Path:
    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        if doc.page_count < 2:
            raise PDFProcessingError("The PDF must have at least 2 pages to split.")

        page_paths = []
        stem = input_path.stem
        for i in range(doc.page_count):
            single = fitz.open()
            single.insert_pdf(doc, from_page=i, to_page=i)
            page_path = output_dir / f"{stem}_page_{i + 1}.pdf"
            single.save(page_path)
            single.close()
            page_paths.append(page_path)

        with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for p in page_paths:
                zf.write(p, arcname=p.name)
    finally:
        doc.close()

    return output_zip_path
