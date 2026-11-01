#!/usr/bin/env python3
"""PHIR — Unified Zero-Cost Runner.

Launches the complete product: FastAPI backend + SQLite database + rich folk-art frontend.
Usage:
    python run.py [--port 8080] [--host 0.0.0.0]
"""

from __future__ import annotations

import argparse
import sys
import os

try:
    import uvicorn
    import fastapi
except ImportError:
    print("Error: Missing required packages. Ensure 'fastapi' and 'uvicorn' are installed.", file=sys.stderr)
    print("Install with: pip install fastapi uvicorn", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Run the PHIR Resource Recovery Platform")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8080")), help="Port to listen on (default: 8080)")
    parser.add_argument("--host", type=str, default=os.environ.get("HOST", "0.0.0.0"), help="Host to bind (default: 0.0.0.0)")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development")
    args = parser.parse_args()

    port = args.port
    host = args.host

    print("=" * 65)
    print("  PHIR — Environmental Resource Recovery Platform (Zero-Cost Stack)")
    print("=" * 65)
    print(f"  • Primary Web Application : http://localhost:{port}/")
    print(f"  • Interactive API Docs   : http://localhost:{port}/docs")
    print(f"  • System Health Check    : http://localhost:{port}/healthz")
    print("=" * 65)
    print("  Press Ctrl+C to stop.\n")

    uvicorn.run("src.main:app", host=host, port=port, reload=args.reload)


if __name__ == "__main__":
    main()
