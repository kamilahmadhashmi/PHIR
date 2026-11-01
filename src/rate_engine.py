"""Dynamic Scrap Rate Card Engine for fair Mandi benchmark pricing.

Provides standardized, market-aligned scrap pricing across localities with zero API cost.
"""

from __future__ import annotations

import datetime
from typing import Optional
import sqlite3

DEFAULT_MANDI_RATES = {
    "pet": 15.0,        # Clean PET plastic bottles
    "cardboard": 12.5,  # Dry corrugated cardboard
    "paper": 9.0,       # Mixed office paper / newspaper
    "aluminium": 110.0, # Clean scrap aluminium cans/sheets
    "glass": 4.5,       # Intact bottles / cullet
    "wood": 3.0,        # Reclaimed scrap wood
}


class RateEngine:
    """Manages scrap rate cards and dynamic valuation."""

    def __init__(self, default_rates: Optional[dict[str, float]] = None):
        self.default_rates = dict(default_rates or DEFAULT_MANDI_RATES)

    def get_rate(self, material_type: str, locality: str = "Delhi", conn: Optional[sqlite3.Connection] = None) -> float:
        mat_key = material_type.lower()
        if conn is not None:
            cur = conn.execute(
                "SELECT rate_per_kg FROM rate_cards WHERE material_type = ? AND (locality = ? OR locality = 'Delhi') ORDER BY (locality = ?) DESC LIMIT 1",
                (mat_key, locality, locality)
            )
            row = cur.fetchone()
            if row:
                return float(row["rate_per_kg"])
        return self.default_rates.get(mat_key, 10.0)

    def calculate_value(self, material_type: str, quantity_kg: float, locality: str = "Delhi", conn: Optional[sqlite3.Connection] = None) -> float:
        rate = self.get_rate(material_type, locality, conn)
        return round(rate * float(quantity_kg), 2)

    def seed_default_rates(self, conn: sqlite3.Connection) -> None:
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        for mat_type, rate in self.default_rates.items():
            conn.execute(
                """
                INSERT INTO rate_cards (id, material_type, rate_per_kg, locality, effective_date, updated_at)
                VALUES (?, ?, ?, 'Delhi', ?, ?)
                ON CONFLICT(material_type, locality) DO UPDATE SET rate_per_kg=excluded.rate_per_kg, updated_at=excluded.updated_at
                """,
                (f"rate_{mat_type}_delhi", mat_type, rate, now, now)
            )
