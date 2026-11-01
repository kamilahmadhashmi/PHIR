#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8080}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

AWS_REGION="${AWS_REGION:-ap-south-1}"
DYNAMODB_ENABLED="${DYNAMODB_ENABLED:-false}"
DYNAMODB_TABLE="${DYNAMODB_TABLE:-phir-recovery}"
ML_S3_BUCKET="${ML_S3_BUCKET:-phir-recovery-ml}"
REKOGNITION_MODEL_ARN="${REKOGNITION_MODEL_ARN:-}"
START_REKOGNITION_MODEL="${START_REKOGNITION_MODEL:-false}"

MODEL_MAY_BE_RUNNING=false

cleanup() {
  if [[ "$MODEL_MAY_BE_RUNNING" == true ]]; then
    echo "Stopping Rekognition model..."
    aws rekognition stop-project-version --project-version-arn "$REKOGNITION_MODEL_ARN" --region "$AWS_REGION" >/dev/null || true
  fi
}
trap cleanup EXIT

if [[ "$START_REKOGNITION_MODEL" == "true" && -n "$REKOGNITION_MODEL_ARN" ]]; then
  export AWS_REGION
  echo "Starting Rekognition model..."
  aws rekognition start-project-version \
    --project-version-arn "$REKOGNITION_MODEL_ARN" \
    --min-inference-units 1 \
    --region "$AWS_REGION" >/dev/null
  MODEL_MAY_BE_RUNNING=true
  for _ in {1..18}; do
    STATUS="$(aws rekognition describe-project-versions \
      --project-arn "${REKOGNITION_MODEL_ARN%/version/*}" \
      --version-names trashnet-v1 \
      --region "$AWS_REGION" \
      --query 'ProjectVersionDescriptions[0].Status' --output text 2>/dev/null || true)"
    [[ "$STATUS" == "RUNNING" ]] && break
    [[ "$STATUS" == "FAILED" || "$STATUS" == "STOPPED" ]] && { echo "Rekognition model failed to start: $STATUS" >&2; exit 1; }
    sleep 5
  done
  [[ "$STATUS" == "RUNNING" ]] || { echo "Timed out waiting for Rekognition model." >&2; exit 1; }
fi

echo "Starting the recovery platform at http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
cd "$ROOT_DIR"
PYTHON_BIN="${PYTHON_BIN:-$ROOT_DIR/.venv/bin/python}"
[[ -x "$PYTHON_BIN" ]] || PYTHON_BIN="python3"
export PORT AWS_REGION DYNAMODB_ENABLED DYNAMODB_TABLE ML_S3_BUCKET REKOGNITION_MODEL_ARN

if "$PYTHON_BIN" -c "import fastapi, uvicorn" 2>/dev/null; then
  echo "Launching unified FastAPI server with full truck-art interface..."
  exec "$PYTHON_BIN" run.py --port "$PORT"
else
  echo "FastAPI not found, falling back to dependency-free standard library server..."
  exec "$PYTHON_BIN" -m src.api_server
fi
