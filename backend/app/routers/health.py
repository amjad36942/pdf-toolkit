"""Health check router."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Health Check", tags=["Health"])
async def health_check():
      """Returns API health and version status."""
      return {
          "status": "ok",
          "message": "PDF Toolkit API is running",
          "version": "1.0.0"
      }
