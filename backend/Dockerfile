FROM python:3.11-slim

# Install system dependencies (LibreOffice for Word/PPTX->PDF)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Create temp directory
RUN mkdir -p /app/tmp

# Expose port
EXPOSE 8000

# Start server — use $PORT from Render environment (fallback to 8000)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
