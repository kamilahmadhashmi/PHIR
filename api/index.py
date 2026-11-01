"""Vercel Serverless Function entrypoint for PHIR Unified FastAPI Application.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Add project root to sys.path so 'src' and modules can be imported
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Signal Vercel environment to use /tmp/phir.db
os.environ.setdefault("VERCEL", "1")

# Prime database and seed deterministic demo fixtures
from src.database import get_db, init_db
from src.repository import SqliteRecoveryRepository

try:
    init_db()
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        repo.seed_initial_data()
except Exception as exc:
    print(f"Notice: Vercel serverless database initialization: {exc}")

from src.main import app

# Vercel ASGI entrypoint
handler = app
