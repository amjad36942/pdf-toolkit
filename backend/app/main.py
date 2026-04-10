# PDF Toolkit Backend - main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn, logging
from app.routers import pdf_convert, pdf_images, pdf_pptx, pdf_tools, pdf_edit, health
from app.services.cleanup import start_cleanup_scheduler
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
@asynccontextmanager
async def lifespan(app: FastAPI):
    start_cleanup_scheduler()
    yield
app = FastAPI(title="PDF Toolkit API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173","https://amjad36942.github.io"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(pdf_convert.router, prefix="/api", tags=["PDF Convert"])
app.include_router(pdf_images.router, prefix="/api", tags=["PDF Images"])
app.include_router(pdf_pptx.router, prefix="/api", tags=["PDF PowerPoint"])
app.include_router(pdf_tools.router, prefix="/api", tags=["PDF Tools"])
app.include_router(pdf_edit.router, prefix="/api", tags=["PDF Edit"])
@app.get("/")
async def root():
    return {"message": "PDF Toolkit API running!"}
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
