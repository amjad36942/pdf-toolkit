"""
PDF Toolkit - Configuration Settings
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Temp directory for file uploads
TEMP_DIR = BASE_DIR / "tmp"
TEMP_DIR.mkdir(exist_ok=True)

# File settings
MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# Auto-cleanup: delete files older than this many minutes
CLEANUP_TTL_MINUTES = 10

# Scheduler interval in minutes
CLEANUP_INTERVAL_MINUTES = 5

# Allowed file extensions per tool
ALLOWED_EXTENSIONS = {
    "pdf": [".pdf"],
    "word": [".doc", ".docx"],
    "image": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"],
    "pptx": [".ppt", ".pptx"],
    "any": [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".ppt", ".pptx"],
}

# CORS origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://amjad36942.github.io",
    os.getenv("FRONTEND_URL", ""),
]

# App settings
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", "8000"))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
