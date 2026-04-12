"""Router: Images<->PDF. POST /api/images-to-pdf  POST /api/pdf-to-images"""
import uuid, logging
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.config import TEMP_DIR, MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS
from app.services.image_service import images_to_pdf, pdf_to_images, create_zip

logger = logging.getLogger(__name__)
router = APIRouter()
IMAGE_EXTS = set(ALLOWED_EXTENSIONS["image"])


@router.post("/images-to-pdf")
async def api_images_to_pdf(files: List[UploadFile] = File(...)):
      if not files:
                raise HTTPException(400, "No files uploaded.")
            paths: List[Path] = []
    for f in files:
              ext = Path(f.filename or "img").suffix.lower()
              if ext not in IMAGE_EXTS:
                            raise HTTPException(400, f"'{f.filename}' not a supported image.")
                        content = await f.read()
        if len(content) > MAX_FILE_SIZE_BYTES:
                      raise HTTPException(413, "File exceeds 50MB.")
                  p = TEMP_DIR / f"{uuid.uuid4()}{ext}"
        p.write_bytes(content)
        paths.append(p)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    try:
              r = images_to_pdf(paths, out)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        for p in paths: p.unlink(missing_ok=True)
              return FileResponse(str(r), media_type="application/pdf", filename="images_combined.pdf")


@router.post("/pdf-to-images")
async def api_pdf_to_images(file: UploadFile = File(...)):
      if not (file.filename or "").lower().endswith(".pdf"):
                raise HTTPException(400, "Only PDF files accepted.")
            content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
              raise HTTPException(413, "File exceeds 50MB.")
    inp = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    inp.write_bytes(content)
    out_dir = TEMP_DIR / uuid.uuid4().hex
    out_dir.mkdir(parents=True, exist_ok=True)
    imgs: List[Path] = []
    zip_path = TEMP_DIR / f"{uuid.uuid4()}.zip"
    try:
              imgs = pdf_to_images(inp, out_dir)
        create_zip(imgs, zip_path)
except Exception as e:
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)
        for p in imgs: p.unlink(missing_ok=True)
                  try: out_dir.rmdir()
                            except: pass
                                  return FileResponse(str(zip_path), media_type="application/zip",
                                                              filename=f"{Path(file.filename).stem}_images.zip")
