"""Router for office document conversions: PDF<->Word, PDF<->Excel, PowerPoint->PDF."""
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from app.services.office import office_convert as office_service
from app.services.pdf.exceptions import PDFProcessingError
from app.utils.file_utils import cleanup_paths, new_job_dir, save_upload

router = APIRouter(prefix="/office", tags=["Office Conversion"])
PDF_ONLY = {".pdf"}
WORD_EXTS = {".doc", ".docx"}
EXCEL_EXTS = {".xls", ".xlsx"}
PPT_EXTS = {".ppt", ".pptx"}


def _cleanup_task(job_dir: Path) -> BackgroundTask:
    return BackgroundTask(cleanup_paths, job_dir)


@router.post("/word-to-pdf")
async def word_to_pdf_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, WORD_EXTS)
        output_path = office_service.word_to_pdf(saved_path, job_dir)
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


@router.post("/pdf-to-word")
async def pdf_to_word_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = office_service.pdf_to_word(saved_path, job_dir)
        return FileResponse(
            output_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="converted.docx",
            background=_cleanup_task(job_dir),
        )
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/excel-to-pdf")
async def excel_to_pdf_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, EXCEL_EXTS)
        output_path = office_service.excel_to_pdf(saved_path, job_dir)
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


@router.post("/pdf-to-excel")
async def pdf_to_excel_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PDF_ONLY)
        output_path = office_service.pdf_to_excel(saved_path, job_dir)
        return FileResponse(
            output_path,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename="converted.xlsx",
            background=_cleanup_task(job_dir),
        )
    except PDFProcessingError as exc:
        cleanup_paths(job_dir)
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        cleanup_paths(job_dir)
        raise
    except Exception:
        cleanup_paths(job_dir)
        raise


@router.post("/ppt-to-pdf")
async def ppt_to_pdf_endpoint(file: UploadFile = File(...)):
    job_dir = new_job_dir()
    try:
        saved_path = await save_upload(file, job_dir, PPT_EXTS)
        output_path = office_service.ppt_to_pdf(saved_path, job_dir)
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
