"""PDF edit router: add text overlay to a specific page. POST /api/edit-pdf"""
import uuid, logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz
from app.config import TEMP_DIR, MAX_FILE_SIZE_BYTES

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/edit-pdf")
async def api_edit_pdf(
      file: UploadFile = File(...),
      page: int = Form(1),
      text: str = Form(...),
      x: float = Form(50),
      y: float = Form(50),
      font_size: float = Form(12),
      color_r: float = Form(0),
      color_g: float = Form(0),
      color_b: float = Form(0),
):
      """
          Add a text annotation/overlay to a specific page of a PDF.
              page: 1-based page number
                  text: text to insert
                      x, y: position in points from top-left
                          font_size: size in points
                              color_r/g/b: RGB color values 0.0-1.0
                                  """
      if not (file.filename or "").lower().endswith(".pdf"):
                raise HTTPException(400, "Only PDF files accepted.")
            content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
              raise HTTPException(413, "File exceeds 50MB.")

    inp = TEMP_DIR / f"{uuid.uuid4()}.pdf"
    inp.write_bytes(content)
    out = TEMP_DIR / f"{uuid.uuid4()}.pdf"

    try:
              with fitz.open(str(inp)) as doc:
                            total = doc.page_count
                            if page < 1 or page > total:
                                              raise HTTPException(400, f"Page {page} out of range (1-{total}).")
                                          pg = doc[page - 1]
                            pg.insert_text(
                                fitz.Point(x, y),
                                text,
                                fontsize=font_size,
                                color=(color_r, color_g, color_b),
                                overlay=True,
                            )
                            doc.save(str(out))
    except HTTPException:
        raise
except Exception as e:
        logger.error(f"Edit PDF error: {e}")
        raise HTTPException(500, str(e))
finally:
        inp.unlink(missing_ok=True)

    stem = Path(file.filename).stem
    return FileResponse(str(out), media_type="application/pdf", filename=f"{stem}_edited.pdf")
