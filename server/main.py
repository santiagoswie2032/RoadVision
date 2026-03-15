import os
import uuid
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("roadvision-api")

# --- Config ---
MODEL_PATH = os.getenv("MODEL_PATH", "ml-pipeline/best.pt")
STORAGE_DIR = "storage/detections"
STATIC_DIR = "client/dist"
PORT = int(os.getenv("PORT", "8000"))
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://nikhilsingh260406_db_user:9HcsYxSgTCr9bzMR@roadvision1.vozkp0h.mongodb.net/RoadVision?retryWrites=true&w=majority")

# --- Database Setup ---
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database() or client["RoadVision"]
potholes_collection = db["potholes"]

# --- Model Lifecycle ---
logger.info(f"Loading YOLOv8 model from {MODEL_PATH}")
if not os.path.exists(MODEL_PATH):
    logger.error(f"Model file not found at {MODEL_PATH}")
model = YOLO(MODEL_PATH)

# --- Schemas ---
class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    confidence: float
    class_name: str

class PotholeDetection(BaseModel):
    bbox: BoundingBox
    severity_score: int
    severity_level: str

class ImageDetectionResponse(BaseModel):
    detection_id: str
    created_at: datetime
    potholes: List[PotholeDetection]
    pothole_count: int
    confidence_avg: float
    overall_severity_score: int
    overall_severity_level: str
    annotated_image_url: str

# Helper for MongoDB ObjectID conversion
def fix_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# --- FastAPI App ---
app = FastAPI(title="RoadVision API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(STORAGE_DIR, exist_ok=True)

# Helper to score potholes
def score_pothole(x1, y1, x2, y2, conf, w, h):
    area = abs((x2-x1)*(y2-y1)) / (w*h)
    score = int(min(area/0.25, 1.0)*60 + conf*40)
    level = "high" if score >= 70 else "medium" if score >= 40 else "low"
    return score, level

# --- API Routes ---

@app.get("/api/health")
def health():
    return {"status": "ok", "database": "connected" if db else "failed"}

@app.post("/predict-image", response_model=ImageDetectionResponse)
async def predict_image(file: UploadFile = File(...)):
    detection_id = uuid.uuid4().hex
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    h, w = frame.shape[:2]
    results = model(frame, conf=0.25)[0]
    
    potholes = []
    confs = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        name = model.names[cls]
        
        score, level = score_pothole(x1, y1, x2, y2, conf, w, h)
        potholes.append(PotholeDetection(
            bbox=BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2, confidence=conf, class_name=name),
            severity_score=score,
            severity_level=level
        ))
        confs.append(conf)

    # Save annotated image
    annotated_frame = results.plot()
    now = datetime.now(timezone.utc)
    rel_path = f"{now.strftime('%Y/%m')}/{detection_id}.jpg"
    out_path = os.path.join(STORAGE_DIR, rel_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    cv2.imwrite(out_path, annotated_frame)

    return ImageDetectionResponse(
        detection_id=detection_id,
        created_at=now,
        potholes=potholes,
        pothole_count=len(potholes),
        confidence_avg=sum(confs)/len(confs) if confs else 0.0,
        overall_severity_score=max([p.severity_score for p in potholes], default=0),
        overall_severity_level="high" if any(p.severity_level == "high" for p in potholes) else "medium" if any(p.severity_level == "medium" for p in potholes) else "low",
        annotated_image_url=f"/static/detections/{rel_path}"
    )

@app.get("/api/potholes")
async def get_potholes():
    cursor = potholes_collection.find().sort("detectedAt", -1)
    results = await cursor.to_list(length=100)
    return [fix_id(r) for r in results]

@app.post("/api/potholes/detect")
async def save_detection(
    latitude: float = Form(...),
    longitude: float = Form(...),
    severityLevel: str = Form(...),
    confidence: float = Form(...),
    imageUrl: str = Form(...),
    description: str = Form(None)
):
    # This endpoint is called by ReportPage after prediction
    pothole_doc = {
        "latitude": latitude,
        "longitude": longitude,
        "severityLevel": severityLevel,
        "detectionConfidence": confidence,
        "imageUrl": imageUrl,
        "description": description or "Auto-detected pothole",
        "status": "reported",
        "detectedAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    result = await potholes_collection.insert_one(pothole_doc)
    return {"status": "success", "id": str(result.inserted_id)}

@app.patch("/api/potholes/{id}/status")
async def update_status(id: str, request: Request):
    data = await request.json()
    new_status = data.get("status")
    if new_status not in ["reported", "under_repair", "fixed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    await potholes_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": new_status, "updatedAt": datetime.now(timezone.utc)}}
    )
    return {"status": "updated"}

# --- Static Files & Frontend ---

# Serve annotated detections
app.mount("/static/detections", StaticFiles(directory=STORAGE_DIR), name="detections")

# Serve React build
if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=f"{STATIC_DIR}/assets"), name="assets")
    
    @app.get("/{rest_of_path:path}")
    async def serve_frontend(rest_of_path: str):
        # API check
        if rest_of_path.startswith("api/") or rest_of_path.startswith("predict"):
            return JSONResponse(status_code=404, content={"detail": f"Route {rest_of_path} not found"})
        
        # Static file check
        file_path = os.path.join(STATIC_DIR, rest_of_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback to index.html for SPA
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
    logger.warning(f"Frontend build directory not found at {STATIC_DIR}")
