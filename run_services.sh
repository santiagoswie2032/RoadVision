#!/bin/bash
# ─────────────────────────────────────────────────
# RoadVision — Start All Services (Local Dev)
# Run this from the project root: bash run_services.sh
# ─────────────────────────────────────────────────

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "=== RoadVision Service Launcher ==="
echo "Project root: $PROJECT_ROOT"

# ── Detect Python ──
if command -v python3 >/dev/null 2>&1 && python3 --version >/dev/null 2>&1; then
    PYTHON_EXE="python3"
elif command -v python >/dev/null 2>&1 && python --version >/dev/null 2>&1; then
    PYTHON_EXE="python"
else
    echo ">>> ERROR: Python not found. Please install Python and add it to your PATH."
    exit 1
fi

# ── Set up Python venv ──
VENV_DIR="$PROJECT_ROOT/services/.venv"

# If venv exists but is broken (no activate script), recreate it
if [ -d "$VENV_DIR" ] && [ ! -f "$VENV_DIR/bin/activate" ] && [ ! -f "$VENV_DIR/Scripts/activate" ]; then
    echo ">>> Removing broken venv..."
    rm -rf "$VENV_DIR"
fi

if [ ! -d "$VENV_DIR" ]; then
    echo ""
    echo ">>> Creating Python virtual environment..."
    $PYTHON_EXE -m venv "$VENV_DIR" || true
fi

# Activate the venv
if [ -f "$VENV_DIR/bin/activate" ]; then
    source "$VENV_DIR/bin/activate"
elif [ -f "$VENV_DIR/Scripts/activate" ]; then
    source "$VENV_DIR/Scripts/activate"
elif [ -f "$PROJECT_ROOT/ml-pipeline/venv/bin/activate" ]; then
    echo ">>> Falling back to ml-pipeline/venv (bin)"
    source "$PROJECT_ROOT/ml-pipeline/venv/bin/activate"
elif [ -f "$PROJECT_ROOT/ml-pipeline/venv/Scripts/activate" ]; then
    echo ">>> Falling back to ml-pipeline/venv (Scripts)"
    source "$PROJECT_ROOT/ml-pipeline/venv/Scripts/activate"
else
    echo ">>> WARNING: No venv found, using system Python"
fi
echo ">>> Python: $($PYTHON_EXE --version)"

# ── Install dependencies for all services ──
echo ""
echo ">>> Installing inference-service dependencies..."
$PYTHON_EXE -m pip install -q -r "$PROJECT_ROOT/services/inference-service/requirements.txt"

echo ">>> Installing complaint-service dependencies..."
$PYTHON_EXE -m pip install -q -r "$PROJECT_ROOT/services/complaint-service/requirements.txt"

echo ">>> Installing orchestrator dependencies..."
$PYTHON_EXE -m pip install -q -r "$PROJECT_ROOT/services/orchestrator/requirements.txt"

echo ""
echo "=== All dependencies installed ==="

# ── Create storage dir ──
mkdir -p "$PROJECT_ROOT/storage/detections"

# ── Start services in background ──
echo ""
echo ">>> Starting Inference Service on :8001..."
cd "$PROJECT_ROOT/services/inference-service"
MODEL_PATH="$PROJECT_ROOT/runs/detect/train2/weights/best.pt" \
STORAGE_DIR="$PROJECT_ROOT/storage/detections" \
$PYTHON_EXE main.py &
INFERENCE_PID=$!

echo ">>> Starting Complaint Service on :8002..."
cd "$PROJECT_ROOT/services/complaint-service"
COMPLAINT_ADAPTER=mock \
$PYTHON_EXE main.py &
COMPLAINT_PID=$!

sleep 3

echo ">>> Starting Orchestrator on :8000..."
cd "$PROJECT_ROOT/services/orchestrator"
INFERENCE_SERVICE_URL=http://localhost:8001 \
COMPLAINT_SERVICE_URL=http://localhost:8002 \
$PYTHON_EXE main.py &
ORCHESTRATOR_PID=$!

echo ""
echo "=== All services starting ==="
echo "  Inference:   http://localhost:8001  (PID: $INFERENCE_PID)"
echo "  Complaint:   http://localhost:8002  (PID: $COMPLAINT_PID)"
echo "  Orchestrator: http://localhost:8000 (PID: $ORCHESTRATOR_PID)"
echo ""
echo ">>> Waiting for services to be ready..."
sleep 5

echo ""
echo "=== Health Checks ==="
curl -s http://localhost:8001/v1/health | $PYTHON_EXE -m json.tool 2>/dev/null || echo "  Inference: not ready yet"
curl -s http://localhost:8002/v1/health | $PYTHON_EXE -m json.tool 2>/dev/null || echo "  Complaint: not ready yet"
curl -s http://localhost:8000/v1/health | $PYTHON_EXE -m json.tool 2>/dev/null || echo "  Orchestrator: not ready yet"

echo ""
echo "=== Ready! Test with: ==="
echo "curl -X POST http://localhost:8000/v1/process/image -F 'file=@ml-pipeline/output_detection.jpg' -F 'latitude=28.6139' -F 'longitude=77.209'"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for any service to exit
wait
