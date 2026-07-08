"""
Page-manipulation services: delete pages, extract pages, rearrange pages.
All three share the same underlying pattern -- build a new document by
selecting/reordering pages from the source -- so they live together here.
"""
from pathlib import Path
from typing import List

import fitz

from app.services.pdf.exceptions import PDFProcessingError
from app.utils.page_ranges import parse_page_spec


def delete_pages(input_path: Path, output_path: Path, pages_spec: str) -> Path:
    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        to_delete = parse_page_spec(pages_spec, doc.page_count)
        if len(to_delete) >= doc.page_count:
            raise PDFProcessingError("Cannot delete every page in the document.")
        doc.delete_pages(to_delete)
        doc.save(output_path, garbage=4, deflate=True)
    finally:
        doc.close()

    return output_path


def extract_pages(input_path: Path, output_path: Path, pages_spec: str) -> Path:
    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        keep = parse_page_spec(pages_spec, doc.page_count)
        new_doc = fitz.open()
        for i in keep:
            new_doc.insert_pdf(doc, from_page=i, to_page=i)
        new_doc.save(output_path, garbage=4, deflate=True)
        new_doc.close()
    finally:
        doc.close()

    return output_path


def rearrange_pages(input_path: Path, output_path: Path, order: List[int]) -> Path:
    try:
        doc = fitz.open(input_path)
    except Exception as exc:
        raise PDFProcessingError("Could not read the PDF: it may be corrupted or password protected.") from exc

    try:
        total = doc.page_count
        if sorted(order) != list(range(1, total + 1)):
            raise PDFProcessingError(f"The new order must contain every page 1-{total} exactly once.")

        new_doc = fitz.open()
        for page_num in order:
            new_doc.insert_pdf(doc, from_page=page_num - 1, to_page=page_num - 1)
        new_doc.save(output_path, garbage=4, deflate=True)
        new_doc.close()
    finally:
        doc.close()

    return output_path
