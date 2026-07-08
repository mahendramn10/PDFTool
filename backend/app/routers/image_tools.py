"""Router for image <-> PDF tools: PDF to JPG, PDF to PNG, JPG to PDF, PNG to PDF."""
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from app.services.pdf import image_convert as image_service
from app.services.pdf.exceptions import PDFProcessingError
from app.utils.file_utils import cleanup_paths, new_job_dir, save_upload

router = APIRouter(prefix="/image", tags=["Image Tools"])
PDF_ONLY = {".pdf"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png"}


def _cleanup_task(job_dir: Path) -> BackgroundTask:
    return BackgroundTask(cleanup_paths, job_dir)


@router.post("/pdf-to-jpg")
async def pdf_to_jpg_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_zip = job_dir / "images.zip"
        image_service.pdf_to_images(saved_path, job_dir, output_zip, fmt="jpg")
        return FileResponse(output_zip, media_type="application/zip", filename="images.zip", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/pdf-to-png")
async def pdf_to_png_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_zip = job_dir / "images.zip"
        image_service.pdf_to_images(saved_path, job_dir, output_zip, fmt="png")
        return FileResponse(output_zip, media_type="application/zip", filename="images.zip", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/jpg-to-pdf")
async def jpg_to_pdf_endpoint(files: list[UploadFile] = File(...)):
    job_dir = new_job_dir()
    try:
        saved_paths = [await save_upload(f, job_dir, IMAGE_EXTS) for f in files]
        output_path = job_dir / "converted.pdf"
        image_service.images_to_pdf(saved_paths, output_path)
        return FileResponse(output_path, media_type="application/pdf", filename="converted.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/png-to-pdf")
async def png_to_pdf_endpoint(files: list[UploadFile] = File(...)):
    job_dir = new_job_dir()
    try:
        saved_paths = [await save_upload(f, job_dir, IMAGE_EXTS) for f in files]
        output_path = job_dir / "converted.pdf"
        image_service.images_to_pdf(saved_paths, output_path)
        return FileResponse(output_path, media_type="application/pdf", filename="converted.pdf", background=_cleanup_task(job_dir))
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise
