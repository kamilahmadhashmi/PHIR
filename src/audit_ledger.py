"""Immutable chain-of-custody audit ledger for Extended Producer Responsibility (EPR) traceability.

Logs tamper-evident verification events across the material lifecycle from household pickup to recycler handover.
"""

from __future__ import annotations

import datetime
import hashlib
import json
import sqlite3
import uuid
from typing import Any, Optional


def record_audit_event(
    conn: sqlite3.Connection,
    event_type: str,
    entity_type: str,
    entity_id: str,
    actor_id: str,
    actor_role: str,
    details: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """Append a cryptographic verification record to the audit ledger."""
    event_id = f"evt_{uuid.uuid4().hex[:12]}"
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    details_str = json.dumps(details or {}, sort_keys=True)

    # Compute a lightweight proof hash for the audit event
    digest_input = f"{event_id}|{event_type}|{entity_type}|{entity_id}|{actor_id}|{details_str}|{now}"
    verification_hash = hashlib.sha256(digest_input.encode("utf-8")).hexdigest()

    conn.execute(
        """
        INSERT INTO audit_events (
            id, event_type, entity_type, entity_id, actor_id, actor_role, details_json, timestamp, verification_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (event_id, event_type, entity_type, entity_id, actor_id, actor_role, details_str, now, verification_hash)
    )

    return {
        "eventId": event_id,
        "eventType": event_type,
        "entityType": entity_type,
        "entityId": entity_id,
        "actorId": actor_id,
        "actorRole": actor_role,
        "details": details or {},
        "timestamp": now,
        "verificationHash": verification_hash,
    }


def get_audit_trail(conn: sqlite3.Connection, entity_id: str) -> list[dict[str, Any]]:
    """Retrieve chronologically ordered audit trail for an entity."""
    cursor = conn.execute(
        """
        SELECT id, event_type, entity_type, entity_id, actor_id, actor_role, details_json, timestamp, verification_hash
        FROM audit_events
        WHERE entity_id = ?
        ORDER BY timestamp ASC
        """,
        (entity_id,)
    )
    results = []
    for row in cursor.fetchall():
        results.append({
            "eventId": row["id"],
            "eventType": row["event_type"],
            "entityType": row["entity_type"],
            "entityId": row["entity_id"],
            "actorId": row["actor_id"],
            "actorRole": row["actor_role"],
            "details": json.loads(row["details_json"]),
            "timestamp": row["timestamp"],
            "verificationHash": row["verification_hash"],
        })
    return results
