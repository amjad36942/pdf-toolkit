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
                        paths.append(_save_pdf(await f.read()))
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
              r = merge_pdfs(paths, out)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        for p in paths: p.unlink(missing_ok=True)
              return FileResponse(str(r), media_type="application/pdf", filename="merged.pdf")


@router.post("/split-pdf")
async def api_split(file: UploadFile = File(...)):
      inp = _save_pdf(await file.read())
    out_dir = TEMP_DIR / uuid.uuid4().hex
    out_dir.mkdir(parents=True, exist_ok=True)
    pages = []
    zip_path = TEMP_DIR / f"{uuid.uuid4()}.zip"
    try:
              pages = split_pdf(inp, out_dir)
        create_zip(pages, zip_path)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)
        for p in pages: p.unlink(missing_ok=True)
                  try: out_dir.rmdir()
                            except: pass
                                  return FileResponse(str(zip_path), media_type="application/zip", filename="split_pages.zip")


@router.post("/delete-pages")
async def api_delete(file: UploadFile = File(...), pages: str = Form(...)):
      try:
                page_nums = [int(x.strip()) for x in pages.split(",") if x.strip()]
except ValueError:
        raise HTTPException(400, "pages must be comma-separated integers, e.g. '1,3,5'")
    inp = _save_pdf(await file.read())
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
              r = delete_pages(inp, out, page_nums)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r), media_type="application/pdf", filename="pages_deleted.pdf")


@router.post("/compress-pdf")
async def api_compress(file: UploadFile = File(...)):
      inp = _save_pdf(await file.read())
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
              r = compress_pdf(inp, out)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r), media_type="application/pdf", filename="compressed.pdf")


@router.post("/watermark-pdf")
async def api_watermark(file: UploadFile = File(...), text: str = Form("CONFIDENTIAL")):
      inp = _save_pdf(await file.read())
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
              r = add_watermark(inp, out, watermark_text=text)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)
    return FileResponse(str(r), media_type="application/pdf", filename="watermarked.pdf")


@router.post("/rotate-pdf")
async def api_rotate(file: UploadFile = File(...), degrees: int = Form(90)):
      if degrees not in (90, 180, 270):
                raise HTTPException(400, "degrees must be 90, 180, or 270.")
            inp = _save_pdf(await file.read())
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
              r = rotate_pdf(inp, out, degrees)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)
      return FileResponse(str(r), media_type="application/pdf", filename="rotated.pdf")
