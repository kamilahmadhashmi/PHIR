# Multi-stage zero-cost container image for PHIR
FROM python:3.13-slim as base

# Set environment flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    HOST=0.0.0.0

WORKDIR /app

# Install lightweight dependencies
RUN pip install --no-cache-dir fastapi==0.143.2 uvicorn==0.54.0 pydantic==2.14.1

# Copy project files
COPY run.py .
COPY src/ ./src/
COPY frontend/ ./frontend/
COPY scripts/ ./scripts/
COPY docs/ ./docs/

# Create persistent storage directory
RUN mkdir -p /app/data

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/healthz')" || exit 1

CMD ["python", "run.py", "--host", "0.0.0.0", "--port", "8080"]
