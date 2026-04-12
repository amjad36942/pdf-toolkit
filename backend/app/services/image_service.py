"""Image<->PDF service using PyMuPDF + Pillow."""
import fitz
import zipfile
import logging
from pathlib import Path
from typing import List
from PIL import Image as PILImage

logger = logging.getLogger(__name__)

PAGE_W = 595.28
PAGE_H = 841.89


def images_to_pdf(image_paths: List[Path], output_path: Path) -> Path:
      doc = fitz.open()
      for img_path in image_paths:
                try:
                              pil = PILImage.open(str(img_path))
                              if pil.mode in ("RGBA", "P", "LA", "1"):
                                                pil = pil.convert("RGB")
                                            use_path = img_path
                              if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                                                use_path = img_path.with_suffix(".jpg")
                                                pil.save(str(use_path), "JPEG", quality=90)
                                            w, h = pil.size
                              scale = min(PAGE_W / w, PAGE_H / h, 1.0)
                              pw, ph = w * scale, h * scale
                              page = doc.new_page(width=PAGE_W, height=PAGE_H)
                              x0 = (PAGE_W - pw) / 2
                              y0 = (PAGE_H - ph) / 2
                              page.insert_image(fitz.Rect(x0, y0, x0 + pw, y0 + ph), filename=str(use_path))
except Exception as e:
            raise RuntimeError(f"Could not process image '{img_path.name}': {e}")
    doc.save(str(output_path), garbage=3, deflate=True)
    doc.close()
    return output_path


def pdf_to_images(input_path: Path, output_dir: Path, dpi: int = 150) -> List[Path]:
      zoom = dpi / 72
      mat = fitz.Matrix(zoom, zoom)
      paths = []
      with fitz.open(str(input_path)) as doc:
                for i, page in enumerate(doc):
                              pix = page.get_pixmap(matrix=mat, alpha=False)
                              out = output_dir / f"page_{i+1}.png"
                              pix.save(str(out))
                              paths.append(out)
                      return paths


def create_zip(file_paths: List[Path], zip_path: Path) -> Path:
      with zipfile.ZipFile(str(zip_path), "w", zipfile.ZIP_DEFLATED) as zf:
                for fp in file_paths:
                              zf.write(str(fp), fp.name)
                      return zip_path
