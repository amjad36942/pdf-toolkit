"""PDF utility tools: merge, split, delete-pages, compress, watermark, rotate."""
import uuid, json, logging
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from app.config import TEMP_DIR, MAX_FILE_SIZE_BYTES
from app.services.pdf_service import merge_pdfs, split_pdf, delete_pages, compress_pdf, add_watermark, rotate_pdf
from app.services.image_service import create_zip

logger = logging.getLogger(__name__)
router = APIRouter()


def _save_pdf(content: bytes) -> Path:
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(413, "File exceeds 50MB.")
    p = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    p.write_bytes(content)
    return p


@router.post("/merge-pdf")
async def api_merge(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(400, "Upload at least 2 PDF files.")
    paths = []
    for f in files:
        if not (f.filename or "").lower().endswith(".pdf"):
            raise HTTPException(400, f"'{f.filename}' is not a PDF.")
        content = await f.read()
        paths.append(_save_pdf(content))
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = merge_pdfs(paths, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        for p in paths:
            p.unlink(missing_ok=True)
    return FileResponse(str(r), media_type="application/pdf", filename="merged.pdf")


@router.post("/split-pdf")
async def api_split(file: UploadFile = File(...)):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    content = await file.read()
    inp = _save_pdf(content)
    zip_out = TEMP_DIR / f"{uuid.uuid4()}.zip"
    try:
        pages = split_pdf(inp)
        zip_path = create_zip(pages, zip_out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    stem = Path(file.filename).stem
    return FileResponse(str(zip_path), media_type="application/zip", filename=f"{stem}_pages.zip")


@router.post("/delete-pages")
async def api_delete_pages(
    file: UploadFile = File(...),
    pages: str = Form(...),
):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    try:
        page_list = [int(p.strip()) for p in pages.split(",")]
    except ValueError:
        raise HTTPException(400, "pages must be comma-separated integers.")
    content = await file.read()
    inp = _save_pdf(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = delete_pages(inp, page_list, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    stem = Path(file.filename).stem
    return FileResponse(str(r), media_type="application/pdf", filename=f"{stem}_deleted.pdf")


@router.post("/compress-pdf")
async def api_compress(file: UploadFile = File(...)):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    content = await file.read()
    inp = _save_pdf(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = compress_pdf(inp, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    stem = Path(file.filename).stem
    return FileResponse(str(r), media_type="application/pdf", filename=f"{stem}_compressed.pdf")


@router.post("/watermark-pdf")
async def api_watermark(
    file: UploadFile = File(...),
    text: str = Form(...),
):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    content = await file.read()
    inp = _save_pdf(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = add_watermark(inp, text, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    stem = Path(file.filename).stem
    return FileResponse(str(r), media_type="application/pdf", filename=f"{stem}_watermarked.pdf")


@router.post("/rotate-pdf")
async def api_rotate(
    file: UploadFile = File(...),
    degrees: int = Form(90),
    pages: str = Form("all"),
):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    if degrees not in (90, 180, 270):
        raise HTTPException(400, "degrees must be 90, 180, or 270.")
    content = await file.read()
    inp = _save_pdf(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = rotate_pdf(inp, degrees, pages, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    stem = Path(file.filename).stem
    return FileResponse(str(r), media_type="application/pdf", filename=f"{stem}_rotated.pdf")
