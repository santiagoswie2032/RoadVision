# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /app/client

# Copy package files and install
COPY client/package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY client/ ./
RUN npm run build

# --- Stage 2: Python Backend ---
FROM python:3.11-slim

# Install system dependencies (ffmpeg for video, libgl1 for opencv)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY server/requirements.txt ./server/
RUN pip install --no-cache-dir -r server/requirements.txt

# Copy backend code and model
COPY server/ ./server/
COPY ml-pipeline/ ./ml-pipeline/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/client/dist ./client/dist

# Ensure storage directory exists
RUN mkdir -p storage/detections

# Set environment
ENV PORT=10000
EXPOSE 10000

# Start application
# Note: Render provides a dynamic PORT, so we use shell form or $PORT
CMD uvicorn server.main:app --host 0.0.0.0 --port $PORT
