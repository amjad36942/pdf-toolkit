"""Router: PDF<->PowerPoint. POST /api/pptx-to-pdf  POST /api/pdf-to-pptx"""
import uuid, logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.config import TEMP_DIR, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS
from app.services.pptx_service import pptx_to_pdf, pdf_to_pptx

logger = logging.getLogger(__name__)
router = APIRouter()
PPTX_EXTS = set(ALLOWED_EXTENSIONS["pptx"])


@router.post("/pptx-to-pdf")
async def api_pptx_to_pdf(file: UploadFile = File(...)):
    ext = Path(file.filename or "f").suffix.lower()
    if ext not in PPTX_EXTS:
        raise HTTPException(400, f"Expected .pptx or .ppt, got '{ext}'")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(413, "File exceeds 50MB.")
    inp = TEMP_DIR / f"{uuid.uuid4()}{ext}"
    inp.write_bytes(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = pptx_to_pdf(inp, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r), media_type="application/pdf",
                        filename=f"{Path(file.filename).stem}_converted.pdf")


@router.post("/pdf-to-pptx")
async def api_pdf_to_pptx(file: UploadFile = File(...)):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted.")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(413, "File exceeds 50MB.")
    inp = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    inp.write_bytes(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pptx"
    try:
        r = pdf_to_pptx(inp, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r),
                        media_type="application/vnd.openxmlformats-presentationml.presentation",
                        filename=f"{Path(file.filename).stem}_converted.pptx")
