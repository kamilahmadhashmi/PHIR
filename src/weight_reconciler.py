"""Physical weight and quality contamination reconciliation engine.

Reconciles household estimates against verified kabadiwala scale weights
and deducts non-recyclable contamination before final payout calculation.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class ReconciliationResult:
    estimated_kg: float
    actual_kg: float
    contamination_pct: float
    net_billable_kg: float
    variance_kg: float
    variance_pct: float
    rate_per_kg: float
    final_payout_inr: float
    notes: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "estimatedKg": self.estimated_kg,
            "actualKg": self.actual_kg,
            "contaminationPct": self.contamination_pct,
            "netBillableKg": round(self.net_billable_kg, 3),
            "varianceKg": round(self.variance_kg, 3),
            "variancePct": round(self.variance_pct, 1),
            "ratePerKg": self.rate_per_kg,
            "finalPayoutInr": round(self.final_payout_inr, 2),
            "notes": self.notes,
        }


def reconcile_collection(
    estimated_kg: float,
    actual_kg: float,
    rate_per_kg: float,
    contamination_pct: float = 0.0,
    notes: Optional[str] = None,
) -> ReconciliationResult:
    """Perform weight reconciliation and payout deduction calculation."""
    if actual_kg < 0:
        raise ValueError("Actual weight cannot be negative")
    if not (0.0 <= contamination_pct <= 100.0):
        raise ValueError("Contamination percentage must be between 0 and 100")

    net_weight = max(0.0, actual_kg * (1.0 - (contamination_pct / 100.0)))
    variance = actual_kg - estimated_kg
    variance_pct = (variance / estimated_kg * 100.0) if estimated_kg > 0 else 0.0
    payout = round(net_weight * rate_per_kg, 2)

    return ReconciliationResult(
        estimated_kg=round(estimated_kg, 3),
        actual_kg=round(actual_kg, 3),
        contamination_pct=round(contamination_pct, 1),
        net_billable_kg=round(net_weight, 3),
        variance_kg=round(variance, 3),
        variance_pct=round(variance_pct, 1),
        rate_per_kg=round(rate_per_kg, 2),
        final_payout_inr=payout,
        notes=notes,
    )
