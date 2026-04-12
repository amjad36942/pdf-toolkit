"""Core PDF processing: merge, split, delete pages, compress, watermark, rotate. Uses PyMuPDF."""
import fitz
import logging
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)


def merge_pdfs(input_paths: List[Path], output_path: Path) -> Path:
      merged = fitz.open()
      for p in input_paths:
                with fitz.open(str(p)) as doc:
                              merged.insert_pdf(doc)
                      merged.save(str(output_path), garbage=3, deflate=True)
            merged.close()
    return output_path


def split_pdf(input_path: Path, output_dir: Path) -> List[Path]:
      result = []
    with fitz.open(str(input_path)) as doc:
              for i in range(doc.page_count):
                            out = fitz.open()
                            out.insert_pdf(doc, from_page=i, to_page=i)
                            p = output_dir / f"page_{i+1}.pdf"
                            out.save(str(p))
                            out.close()
                            result.append(p)
                    return result


def delete_pages(input_path: Path, output_path: Path, pages_to_delete: List[int]) -> Path:
      with fitz.open(str(input_path)) as doc:
                total = doc.page_count
                zero = set(p - 1 for p in pages_to_delete if 1 <= p <= total)
                keep = [i for i in range(total) if i not in zero]
                if not keep:
                              raise ValueError("Cannot delete all pages.")
                          new = fitz.open()
        for i in keep:
                      new.insert_pdf(doc, from_page=i, to_page=i)
                  new.save(str(output_path))
        new.close()
    return output_path


def compress_pdf(input_path: Path, output_path: Path) -> Path:
      with fitz.open(str(input_path)) as doc:
                doc.save(str(output_path), garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, clean=True)
    return output_path


def add_watermark(input_path: Path, output_path: Path, watermark_text: str = "CONFIDENTIAL", font_size: int = 60) -> Path:
      with fitz.open(str(input_path)) as doc:
                for page in doc:
                              r = page.rect
                              page.insert_text(
                                  fitz.Point(r.width * 0.15, r.height * 0.60),
                                  watermark_text,
                                  fontsize=font_size,
                                  color=(0.75, 0.75, 0.75),
                                  rotate=45,
                                  overlay=False,
                              )
                          doc.save(str(output_path))
    return output_path


def rotate_pdf(input_path: Path, output_path: Path, rotation: int = 90) -> Path:
      if rotation not in (90, 180, 270):
                raise ValueError("Rotation must be 90, 180, or 270.")
    with fitz.open(str(input_path)) as doc:
              for page in doc:
                            page.set_rotation((page.rotation + rotation) % 360)
                        doc.save(str(output_path))
    return output_path
