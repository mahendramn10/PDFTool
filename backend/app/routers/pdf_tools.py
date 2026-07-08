"""
Router for core page-level PDF tools: merge, split, compress, rotate,
delete/extract/rearrange pages, watermark, page numbers.

Every endpoint follows the same lifecycle:
  1. create an isolated job directory
  2. validate + save uploads into it
  3. run the pure business-logic service function
  4. stream the result back
  5. clean up the job directory in a `finally` block
"""
import json
from pathlib import Path

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import FileResponse

from app.services.pdf import compress as compress_service
from app.services.pdf import merge as merge_service
from app.services.pdf import pages as pages_service
from app.services.pdf import page_numbers as page_numbers_service
from app.services.pdf import rotate as rotate_service
from app.services.pdf import split as split_service
from app.services.pdf import watermark as watermark_service
from app.services.pdf.exceptions import PDFProcessingError
from app.utils.file_utils import cleanup_paths, new_job_dir, save_upload
from fastapi import HTTPException, status

router = APIRouter(prefix="/pdf", tags=["PDF Tools"])
PDF_ONLY = {".pdf"}


@router.post("/merge")
async def merge_pdf_endpoint(files: list[UploadFile] = File(...)):
    job_dir = new_job_dir()
    try:
        if len(files) < 2:
            raise HTTPException(status_code=400, detail="Please upload at least two PDF files.")
        saved_paths = [await save_upload(f, job_dir, PDF_ONLY) for f in files]
        output_path = job_dir / "merged.pdf"
        merge_service.merge_pdfs(saved_paths, output_path)
        return FileResponse(output_path, media_type="application/pdf", filename="merged.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/split")
async def split_pdf_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_zip = job_dir / "split_pages.zip"
        split_service.split_pdf(saved_path, job_dir, output_zip)
        return FileResponse(output_zip, media_type="application/zip", filename="split_pages.zip", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/compress")
async def compress_pdf_endpoint(file: UploadFile = File(...), quality: str = Form("recommended")):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = job_dir / "compressed.pdf"
        compress_service.compress_pdf(saved_path, output_path, quality=quality)
        return FileResponse(output_path, media_type="application/pdf", filename="compressed.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/rotate")
async def rotate_pdf_endpoint(file: UploadFile = File(...), angle: int = Form(...), pages: str | None = Form(None)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = job_dir / "rotated.pdf"
        rotate_service.rotate_pdf(saved_path, output_path, angle=angle, pages_spec=pages)
        return FileResponse(output_path, media_type="application/pdf", filename="rotated.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/delete-pages")
async def delete_pages_endpoint(file: UploadFile = File(...), pages: str = Form(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = job_dir / "edited.pdf"
        pages_service.delete_pages(saved_path, output_path, pages_spec=pages)
        return FileResponse(output_path, media_type="application/pdf", filename="edited.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/extract-pages")
async def extract_pages_endpoint(file: UploadFile = File(...), pages: str = Form(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = job_dir / "extracted.pdf"
        pages_service.extract_pages(saved_path, output_path, pages_spec=pages)
        return FileResponse(output_path, media_type="application/pdf", filename="extracted.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/rearrange-pages")
async def rearrange_pages_endpoint(file: UploadFile = File(...), order: str = Form(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        try:
            parsed_order = json.loads(order)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="order must be a JSON array of page numbers, e.g. [3,1,2]")
        output_path = job_dir / "rearranged.pdf"
        pages_service.rearrange_pages(saved_path, output_path, order=parsed_order)
        return FileResponse(output_path, media_type="application/pdf", filename="rearranged.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/watermark")
async def watermark_endpoint(
    file: UploadFile = File(...),
    text: str = Form(...),
    opacity: float = Form(0.3),
    font_size: int = Form(40),
    rotation: int = Form(45),
    position: str = Form("center"),
):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = job_dir / "watermarked.pdf"
        watermark_service.add_watermark(saved_path, output_path, text=text, opacity=opacity, font_size=font_size, rotation=rotation, position=position)
        return FileResponse(output_path, media_type="application/pdf", filename="watermarked.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/page-numbers")
async def page_numbers_endpoint(
    file: UploadFile = File(...),
    position: str = Form("bottom-center"),
    start_number: int = Form(1),
    font_size: int = Form(11),
):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = job_dir / "numbered.pdf"
        page_numbers_service.add_page_numbers(saved_path, output_path, position=position, start_number=start_number, font_size=font_size)
        return FileResponse(output_path, media_type="application/pdf", filename="numbered.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


def _cleanup_task(job_dir: Path):
    from starlette.background import BackgroundTask
    return BackgroundTask(cleanup_paths, job_dir)
