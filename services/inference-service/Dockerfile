# ── Build stage ────────────────────────────────
FROM python:3.11-slim AS base

WORKDIR /app

# System deps for OpenCV headless + ffmpeg for video processing
RUN apt-get update && \
    apt-get install -y --no-install-recommends libgl1 libglib2.0-0 ffmpeg && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# ── Runtime ────────────────────────────────────
ENV MODEL_PATH=/app/model/best.pt
ENV STORAGE_DIR=/app/storage/detections
ENV INFERENCE_HOST=0.0.0.0

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import requests; r=requests.get(f'http://localhost:{__import__(\"os\").getenv(\"PORT\",8001)}/v1/health'); exit(0 if r.ok else 1)"

# Use shell form so $PORT is expanded at runtime (Render assigns PORT)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}
