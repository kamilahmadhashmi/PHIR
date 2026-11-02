"""Zero-cost transactional relational database engine for PHIR using SQLite 3.

Configured with Write-Ahead Logging (WAL) and foreign keys for high concurrency
and ACID transaction guarantees with zero external dependencies.
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Generator, Optional

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = ROOT / "data" / "phir.db"

_local = threading.local()


def get_db_path() -> Path:
    override = os.getenv("PHIR_DB_PATH")
    if override:
        return Path(override)
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        return Path("/tmp/phir.db")
    DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return DEFAULT_DB_PATH


def create_connection(db_path: Optional[str | Path] = None) -> sqlite3.Connection:
    target = str(db_path or get_db_path())
    conn = sqlite3.connect(target, timeout=10.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    if target != ":memory:":
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA busy_timeout = 5000;")
    return conn


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    radius_km REAL DEFAULT 25.0,
    supported_materials TEXT DEFAULT '[]',
    rating REAL DEFAULT 4.8,
    price_factor REAL DEFAULT 1.0,
    locality TEXT NOT NULL,
    contact TEXT,
    is_demo INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    material_type TEXT NOT NULL,
    quantity_kg REAL NOT NULL,
    actual_quantity_kg REAL,
    estimated_value REAL NOT NULL,
    actual_value REAL,
    source_id TEXT NOT NULL,
    current_holder_id TEXT NOT NULL,
    destination_id TEXT,
    status TEXT NOT NULL,
    collection_request_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_requests (
    id TEXT PRIMARY KEY,
    household_id TEXT NOT NULL,
    assigned_kabadiwala_id TEXT,
    status TEXT NOT NULL,
    is_demo INTEGER DEFAULT 1,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    material_ids TEXT NOT NULL,
    quantity_by_type TEXT NOT NULL,
    estimated_value REAL NOT NULL,
    actual_value REAL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recycler_requirements (
    id TEXT PRIMARY KEY,
    recycler_id TEXT NOT NULL,
    material_type TEXT NOT NULL,
    required_quantity_kg REAL NOT NULL,
    minimum_quantity_kg REAL DEFAULT 0.0,
    fulfilled_quantity_kg REAL DEFAULT 0.0,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    recycler_id TEXT NOT NULL,
    kabadiwala_id TEXT NOT NULL,
    requirement_id TEXT,
    material_type TEXT NOT NULL,
    quantity_kg REAL NOT NULL,
    material_ids TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_cards (
    id TEXT PRIMARY KEY,
    material_type TEXT NOT NULL,
    rate_per_kg REAL NOT NULL,
    locality TEXT NOT NULL,
    effective_date TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(material_type, locality)
);

CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    details_json TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    verification_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pilot_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    role_type TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    estimated_monthly_kg REAL DEFAULT 0.0,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_materials_holder_status ON materials(current_holder_id, status);
CREATE INDEX IF NOT EXISTS idx_materials_source ON materials(source_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON collection_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_household ON collection_requests(household_id);
CREATE INDEX IF NOT EXISTS idx_requests_assigned ON collection_requests(assigned_kabadiwala_id, status);
CREATE INDEX IF NOT EXISTS idx_requirements_recycler ON recycler_requirements(recycler_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_recycler ON bookings(recycler_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_kabadiwala ON bookings(kabadiwala_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_type, entity_id);
"""

_initialized_dbs = set()


def _ensure_db(target: str) -> None:
    if target in _initialized_dbs:
        return
    conn = create_connection(target)
    try:
        conn.executescript(SCHEMA_SQL)
        conn.commit()
        cur = conn.execute("SELECT COUNT(*) AS count FROM profiles;")
        if cur.fetchone()["count"] == 0:
            from .repository import SqliteRecoveryRepository
            repo = SqliteRecoveryRepository(conn)
            repo.seed_initial_data()
            conn.commit()
        _initialized_dbs.add(target)
    finally:
        conn.close()


@contextmanager
def get_db(db_path: Optional[str | Path] = None) -> Generator[sqlite3.Connection, None, None]:
    target = str(db_path or get_db_path())
    _ensure_db(target)
    conn = create_connection(target)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db(db_path: Optional[str | Path] = None) -> None:
    """Initialize schema tables, constraints, and indexes."""
    target = str(db_path or get_db_path())
    _initialized_dbs.discard(target)
    _ensure_db(target)
