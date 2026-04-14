"""Router: PDF<->Word. POST /api/pdf-to-word  POST /api/word-to-pdf"""
import uuid, logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.config import TEMP_DIR, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS
from app.services.convert_service import pdf_to_word, word_to_pdf

logger = logging.getLogger(__name__)
router = APIRouter()


async def _save(file: UploadFile, key: str) -> Path:
    ext = Path(file.filename or "f").suffix.lower()
    allowed = ALLOWED_EXTENSIONS.get(key, [])
    if ext not in allowed:
        raise HTTPException(400, f"Invalid type '{ext}'. Allowed: {allowed}")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(413, "File exceeds 50MB limit.")
    p = TEMP_DIR / f"{uuid.uuid4()}{ext}"
    p.write_bytes(content)
    return p


@router.post("/pdf-to-word")
async def api_pdf_to_word(file: UploadFile = File(...)):
    inp = await _save(file, "pdf")
    out = TEMP_DIR / f"{uuid.uuid4()}.docx"
    try:
        r = pdf_to_word(inp, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r),
                        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        filename=f"{Path(file.filename).stem}_converted.docx")


@router.post("/word-to-pdf")
async def api_word_to_pdf(file: UploadFile = File(...)):
    inp = await _save(file, "word")
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
        r = word_to_pdf(inp, out)
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r), media_type="application/pdf",
                        filename=f"{Path(file.filename).stem}_converted.pdf")
