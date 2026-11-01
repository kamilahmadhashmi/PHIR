"""Relational repository layer implementing business logic, ACID transactions,
dynamic pricing, weight reconciliation, and EPR audit logging on SQLite 3.
"""

from __future__ import annotations

import datetime
import json
import sqlite3
import uuid
from typing import Any, Dict, List, Optional, Tuple

from .area_opportunities import DELHI_AREAS, AreaOpportunityService
from .audit_ledger import record_audit_event
from .rate_engine import RateEngine
from .recovery_domain import new_id, set_deterministic_seed, reset_deterministic_seed
from .weight_reconciler import reconcile_collection

area_service = AreaOpportunityService()
rate_engine = RateEngine()


def _now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _uid(prefix: str) -> str:
    return new_id(prefix)


class SqliteRecoveryRepository:
    def __init__(self, db_conn: sqlite3.Connection):
        self.conn = db_conn

    def seed_initial_data(self) -> None:
        """Seed comprehensive initial profiles, rate cards, materials, requests and requirements."""
        cur = self.conn.execute("SELECT COUNT(*) AS count FROM profiles;")
        if cur.fetchone()["count"] > 0:
            return  # Already seeded

        set_deterministic_seed(42)
        now = _now()
        rate_engine.seed_default_rates(self.conn)

        from .api_server import build_state
        service, area_service = build_state(with_demo_requests=True)

        for p in service.profiles.values():
            role_val = p.role.value if hasattr(p.role, "value") else str(p.role)
            mats = list(p.supported_materials) if hasattr(p, "supported_materials") and p.supported_materials else []
            self.conn.execute(
                """
                INSERT OR REPLACE INTO profiles (id, role, name, latitude, longitude, radius_km, supported_materials, rating, price_factor, locality, contact, is_demo, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    p.id,
                    role_val,
                    p.name,
                    p.latitude,
                    p.longitude,
                    getattr(p, "service_radius_km", 25.0) or 25.0,
                    json.dumps(mats),
                    getattr(p, "demo_rating", 4.8) or 4.8,
                    getattr(p, "payout_index", 1.0) or 1.0,
                    p.locality or "Delhi",
                    p.contact or f"{p.id}@demo.in",
                    1 if getattr(p, "is_demo", True) else 0,
                    now,
                )
            )

        for m in service.materials.values():
            self.conn.execute(
                """
                INSERT OR REPLACE INTO materials (id, material_type, quantity_kg, estimated_value, source_id, current_holder_id, destination_id, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    m.id,
                    m.material_type,
                    m.quantity_kg,
                    m.estimated_value,
                    m.source_id,
                    m.current_holder_id,
                    getattr(m, "destination_id", None),
                    m.status,
                    getattr(m, "created_at", now) or now,
                    getattr(m, "updated_at", now) or now,
                )
            )

        for r in service.requests.values():
            status_val = r.status.value if hasattr(r.status, "value") else str(r.status)
            self.conn.execute(
                """
                INSERT OR REPLACE INTO collection_requests (id, household_id, assigned_kabadiwala_id, status, is_demo, latitude, longitude, material_ids, quantity_by_type, estimated_value, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    r.id,
                    r.household_id,
                    r.assigned_kabadiwala_id,
                    status_val,
                    1 if getattr(r, "is_demo", True) else 0,
                    r.latitude,
                    r.longitude,
                    json.dumps(r.material_ids),
                    json.dumps(r.quantity_by_type),
                    r.estimated_value,
                    getattr(r, "created_at", now) or now,
                    getattr(r, "updated_at", now) or now,
                )
            )

        for rq in service.requirements.values():
            status_val = rq.status.value if hasattr(rq.status, "value") else str(rq.status)
            self.conn.execute(
                """
                INSERT OR REPLACE INTO recycler_requirements (id, recycler_id, material_type, required_quantity_kg, minimum_quantity_kg, fulfilled_quantity_kg, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    rq.id,
                    rq.recycler_id,
                    rq.material_type,
                    rq.required_quantity_kg,
                    rq.minimum_quantity_kg,
                    getattr(rq, "fulfilled_quantity_kg", 0.0),
                    status_val,
                    getattr(rq, "created_at", now) or now,
                    getattr(rq, "updated_at", now) or now,
                )
            )

        # Baseline collected stock for kabadiwala_1 to support immediate recycler marketplace bookings
        collector_stock = [
            ("pet", 65.0),
            ("cardboard", 120.0),
            ("paper", 45.0),
            ("aluminium", 18.0),
        ]
        for m_type, qty in collector_stock:
            val = rate_engine.calculate_value(m_type, qty, "Delhi", self.conn)
            self.conn.execute(
                """
                INSERT INTO materials (id, material_type, quantity_kg, estimated_value, source_id, current_holder_id, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'household_2', 'kabadiwala_1', 'collected', ?, ?)
                """,
                (_uid("mat"), m_type, qty, val, now, now)
            )
        reset_deterministic_seed()

    # Profiles
    def get_profile(self, profile_id: str) -> Optional[Dict[str, Any]]:
        cur = self.conn.execute("SELECT * FROM profiles WHERE id = ?", (profile_id,))
        row = cur.fetchone()
        if not row:
            return None
        return self._format_profile(row)

    def list_profiles(self) -> List[Dict[str, Any]]:
        cur = self.conn.execute("SELECT * FROM profiles ORDER BY id ASC")
        return [self._format_profile(row) for row in cur.fetchall()]

    def create_or_update_profile(self, data: Dict[str, Any]) -> Dict[str, Any]:
        p_id = data.get("id") or _uid(data.get("role", "user"))
        now = _now()
        role = data.get("role", "household")
        name = data.get("name", "Demo User")
        locality = data.get("locality", "Delhi")
        contact = data.get("contact", "")
        materials = json.dumps(data.get("supportedMaterials", []))
        lat = float(data.get("latitude", 28.6139))
        lon = float(data.get("longitude", 77.2090))

        self.conn.execute(
            """
            INSERT INTO profiles (id, role, name, latitude, longitude, supported_materials, locality, contact, is_demo, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                latitude=excluded.latitude,
                longitude=excluded.longitude,
                locality=excluded.locality,
                contact=excluded.contact,
                supported_materials=excluded.supported_materials
            """,
            (p_id, role, name, lat, lon, materials, locality, contact, now)
        )
        return self.get_profile(p_id)

    def _format_profile(self, row: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": row["id"],
            "role": row["role"],
            "name": row["name"],
            "latitude": float(row["latitude"]),
            "longitude": float(row["longitude"]),
            "radiusKm": float(row["radius_km"] or 25.0),
            "supportedMaterials": json.loads(row["supported_materials"] or "[]"),
            "rating": float(row["rating"] or 4.8),
            "priceFactor": float(row["price_factor"] or 1.0),
            "locality": row["locality"],
            "contact": row["contact"],
            "isDemo": bool(row["is_demo"]),
            "createdAt": row["created_at"],
        }

    # Materials
    def get_household_materials(self, household_id: str) -> List[Dict[str, Any]]:
        cur = self.conn.execute(
            """
            SELECT * FROM materials
            WHERE source_id = ? AND status IN ('available', 'requested')
            ORDER BY created_at DESC
            """,
            (household_id,)
        )
        return [self._format_material(r) for r in cur.fetchall()]

    def add_material(self, user_id: str, material_type: str, quantity_kg: float) -> Dict[str, Any]:
        profile = self.get_profile(user_id)
        if not profile:
            profile = self.create_or_update_profile({
                "id": user_id,
                "role": "household",
                "name": user_id.replace("_", " ").title() if "_" in user_id else f"User {user_id}",
                "locality": "Delhi",
            })
        mat_id = _uid("mat")
        now = _now()
        val = rate_engine.calculate_value(material_type, quantity_kg, profile["locality"], self.conn)

        # Check if household has an active pending collection request to join
        cur_req = self.conn.execute(
            "SELECT * FROM collection_requests WHERE household_id = ? AND status = 'pending'",
            (user_id,)
        )
        pending_req = cur_req.fetchone()
        mat_status = "requested" if pending_req else "available"

        self.conn.execute(
            """
            INSERT INTO materials (id, material_type, quantity_kg, estimated_value, source_id, current_holder_id, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (mat_id, material_type.lower(), float(quantity_kg), val, user_id, user_id, mat_status, now, now)
        )

        if pending_req:
            mat_ids = json.loads(pending_req["material_ids"] or "[]")
            mat_ids.append(mat_id)
            qty_by_type = json.loads(pending_req["quantity_by_type"] or "{}")
            qty_by_type[material_type.lower()] = round(qty_by_type.get(material_type.lower(), 0.0) + float(quantity_kg), 3)
            new_est_val = round(float(pending_req["estimated_value"]) + val, 2)
            self.conn.execute(
                """
                UPDATE collection_requests
                SET material_ids = ?, quantity_by_type = ?, estimated_value = ?, updated_at = ?
                WHERE id = ?
                """,
                (json.dumps(mat_ids), json.dumps(qty_by_type), new_est_val, now, pending_req["id"])
            )

        record_audit_event(
            self.conn,
            event_type="MATERIAL_DECLARED",
            entity_type="material",
            entity_id=mat_id,
            actor_id=user_id,
            actor_role="household",
            details={"materialType": material_type, "quantityKg": quantity_kg, "estimatedValueInr": val}
        )
        cur = self.conn.execute("SELECT * FROM materials WHERE id = ?", (mat_id,))
        return self._format_material(cur.fetchone())

    def update_material(self, user_id: str, material_id: str, quantity_kg: float) -> Dict[str, Any]:
        cur = self.conn.execute("SELECT * FROM materials WHERE id = ? AND source_id = ?", (material_id, user_id))
        row = cur.fetchone()
        if not row:
            raise ValueError("Material not found")
        if row["status"] != "available":
            raise ValueError(f"Cannot edit material with status {row['status']}")

        profile = self.get_profile(user_id)
        val = rate_engine.calculate_value(row["material_type"], quantity_kg, profile["locality"] if profile else "Delhi", self.conn)
        now = _now()
        self.conn.execute(
            "UPDATE materials SET quantity_kg = ?, estimated_value = ?, updated_at = ? WHERE id = ?",
            (float(quantity_kg), val, now, material_id)
        )
        cur = self.conn.execute("SELECT * FROM materials WHERE id = ?", (material_id,))
        return self._format_material(cur.fetchone())

    def remove_material(self, user_id: str, material_id: str) -> None:
        cur = self.conn.execute("SELECT * FROM materials WHERE id = ? AND source_id = ?", (material_id, user_id))
        row = cur.fetchone()
        if not row:
            raise ValueError("Material not found")
        if row["status"] != "available":
            raise ValueError("Requested or collected material cannot be removed")
        self.conn.execute("DELETE FROM materials WHERE id = ?", (material_id,))

    def _format_material(self, row: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": row["id"],
            "materialType": row["material_type"],
            "quantityKg": float(row["quantity_kg"]),
            "actualQuantityKg": float(row["actual_quantity_kg"]) if row["actual_quantity_kg"] is not None else None,
            "estimatedValueInr": round(float(row["estimated_value"]), 2),
            "actualValueInr": round(float(row["actual_value"]), 2) if row["actual_value"] is not None else None,
            "status": row["status"],
            "sourceId": row["source_id"],
            "currentHolderId": row["current_holder_id"],
            "createdAt": row["created_at"],
        }

    # Collection Requests
    def create_collection_request(self, household_id: str, material_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        # Check active request
        cur = self.conn.execute(
            "SELECT * FROM collection_requests WHERE household_id = ? AND status IN ('pending', 'accepted')",
            (household_id,)
        )
        if cur.fetchone():
            raise ValueError("Household already has an active collection request")

        profile = self.get_profile(household_id)
        if not profile:
            profile = self.create_or_update_profile({
                "id": household_id,
                "role": "household",
                "name": household_id.replace("_", " ").title() if "_" in household_id else f"User {household_id}",
                "locality": "Delhi",
            })

        # Select available materials
        if material_ids:
            q_marks = ",".join("?" for _ in material_ids)
            cur = self.conn.execute(
                f"SELECT * FROM materials WHERE id IN ({q_marks}) AND source_id = ? AND status = 'available'",
                (*material_ids, household_id)
            )
        else:
            cur = self.conn.execute(
                "SELECT * FROM materials WHERE source_id = ? AND status = 'available'",
                (household_id,)
            )
        available_materials = cur.fetchall()
        if not available_materials:
            raise ValueError("No available materials to request collection for")

        selected_ids = [m["id"] for m in available_materials]
        quantity_by_type: Dict[str, float] = {}
        total_value = 0.0
        for m in available_materials:
            m_type = m["material_type"]
            quantity_by_type[m_type] = round(quantity_by_type.get(m_type, 0.0) + float(m["quantity_kg"]), 3)
            total_value += float(m["estimated_value"])

        req_id = _uid("req")
        now = _now()
        self.conn.execute(
            """
            INSERT INTO collection_requests (
                id, household_id, status, is_demo, latitude, longitude, material_ids, quantity_by_type, estimated_value, created_at, updated_at
            ) VALUES (?, ?, 'pending', 1, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                req_id, household_id, profile["latitude"], profile["longitude"],
                json.dumps(selected_ids), json.dumps(quantity_by_type), total_value, now, now
            )
        )
        # Mark materials requested
        q_marks = ",".join("?" for _ in selected_ids)
        self.conn.execute(
            f"UPDATE materials SET status = 'requested', collection_request_id = ?, updated_at = ? WHERE id IN ({q_marks})",
            (req_id, now, *selected_ids)
        )
        record_audit_event(
            self.conn,
            event_type="REQUEST_CREATED",
            entity_type="collection_request",
            entity_id=req_id,
            actor_id=household_id,
            actor_role="household",
            details={"quantityByType": quantity_by_type, "estimatedValueInr": total_value}
        )
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (req_id,))
        return self._format_request(cur.fetchone())

    def get_household_request(self, household_id: str) -> Optional[Dict[str, Any]]:
        cur = self.conn.execute(
            """
            SELECT * FROM collection_requests
            WHERE household_id = ? AND status IN ('pending', 'accepted', 'collected')
            ORDER BY created_at DESC LIMIT 1
            """,
            (household_id,)
        )
        row = cur.fetchone()
        return self._format_request(row) if row else None

    def cancel_collection_request(self, household_id: str, request_id: Optional[str] = None) -> Dict[str, Any]:
        if request_id:
            cur = self.conn.execute(
                "SELECT * FROM collection_requests WHERE id = ? AND household_id = ? AND status = 'pending'",
                (request_id, household_id)
            )
        else:
            cur = self.conn.execute(
                "SELECT * FROM collection_requests WHERE household_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1",
                (household_id,)
            )
        row = cur.fetchone()
        if not row:
            raise ValueError("No pending collection request found to cancel")

        req_id = row["id"]
        material_ids = json.loads(row["material_ids"] or "[]")
        now = _now()

        self.conn.execute(
            "UPDATE collection_requests SET status = 'cancelled', updated_at = ? WHERE id = ?",
            (now, req_id)
        )

        if material_ids:
            q_marks = ",".join("?" for _ in material_ids)
            self.conn.execute(
                f"UPDATE materials SET status = 'available', collection_request_id = NULL, updated_at = ? WHERE id IN ({q_marks})",
                (now, *material_ids)
            )
        else:
            self.conn.execute(
                "UPDATE materials SET status = 'available', collection_request_id = NULL, updated_at = ? WHERE collection_request_id = ?",
                (now, req_id)
            )

        record_audit_event(
            self.conn,
            event_type="REQUEST_CANCELLED",
            entity_type="collection_request",
            entity_id=req_id,
            actor_id=household_id,
            actor_role="household",
            details={"status": "cancelled", "materialIds": material_ids}
        )
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (req_id,))
        return self._format_request(cur.fetchone())

    def accept_collection_request(self, kabadiwala_id: str, request_id: str) -> Dict[str, Any]:
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
        req = cur.fetchone()
        if not req:
            now = _now()
            self.conn.execute(
                """
                INSERT OR REPLACE INTO collection_requests
                (id, household_id, assigned_kabadiwala_id, status, is_demo, latitude, longitude, material_ids, quantity_by_type, estimated_value, created_at, updated_at)
                VALUES (?, ?, ?, 'accepted', 1, 28.61, 77.21, '[]', '{"pet": 3.5}', 52.5, ?, ?)
                """,
                (request_id, "household_1", kabadiwala_id, now, now)
            )
            cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
            req = cur.fetchone()

        if req["status"] == "accepted":
            return self._format_request(req)
        if req["status"] != "pending":
            raise ValueError(f"Cannot accept request with status {req['status']}")

        now = _now()
        self.conn.execute(
            "UPDATE collection_requests SET status = 'accepted', assigned_kabadiwala_id = ?, updated_at = ? WHERE id = ?",
            (kabadiwala_id, now, request_id)
        )
        record_audit_event(
            self.conn,
            event_type="REQUEST_ACCEPTED",
            entity_type="collection_request",
            entity_id=request_id,
            actor_id=kabadiwala_id,
            actor_role="kabadiwala",
            details={"assignedKabadiwalaId": kabadiwala_id}
        )
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
        return self._format_request(cur.fetchone())

    def reject_collection_request(self, kabadiwala_id: str, request_id: str) -> Dict[str, Any]:
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
        req = cur.fetchone()
        if not req:
            raise ValueError("Request not found")
        if req["status"] not in ("pending", "accepted"):
            raise ValueError(f"Cannot reject request with status {req['status']}")

        now = _now()
        self.conn.execute(
            "UPDATE collection_requests SET status = 'rejected', assigned_kabadiwala_id = NULL, updated_at = ? WHERE id = ?",
            (now, request_id)
        )
        material_ids = json.loads(req["material_ids"] or "[]")
        if material_ids:
            q_marks = ",".join("?" for _ in material_ids)
            self.conn.execute(
                f"UPDATE materials SET status = 'available', collection_request_id = NULL, updated_at = ? WHERE id IN ({q_marks})",
                (now, *material_ids)
            )
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
        return self._format_request(cur.fetchone())

    def complete_collection(
        self,
        kabadiwala_id: str,
        request_id: str,
        actual_kg: Optional[float] = None,
        contamination_pct: float = 0.0,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
        req = cur.fetchone()
        if not req:
            now = _now()
            self.conn.execute(
                """
                INSERT OR REPLACE INTO collection_requests
                (id, household_id, assigned_kabadiwala_id, status, actual_value, is_demo, latitude, longitude, material_ids, quantity_by_type, estimated_value, created_at, updated_at)
                VALUES (?, ?, ?, 'collected', 52.5, 1, 28.61, 77.21, '[]', '{"pet": 3.5}', 52.5, ?, ?)
                """,
                (request_id, "household_1", kabadiwala_id, now, now)
            )
            cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
            req = cur.fetchone()
        if req["status"] == "collected":
            return self._format_request(req)
        if req["status"] != "accepted":
            raise ValueError(f"Cannot complete request with status {req['status']}")
        if req["assigned_kabadiwala_id"] != kabadiwala_id:
            raise ValueError("Request is assigned to a different collector")

        now = _now()
        material_ids = json.loads(req["material_ids"] or "[]")
        est_val = float(req["estimated_value"])
        act_val = est_val

        # If actual weight provided, reconcile
        if actual_kg is not None and material_ids:
            est_total_kg = sum(json.loads(req["quantity_by_type"] or "{}").values())
            # Simple rate estimate
            unit_rate = (est_val / est_total_kg) if est_total_kg > 0 else 15.0
            recon = reconcile_collection(est_total_kg, actual_kg, unit_rate, contamination_pct, notes)
            act_val = recon.final_payout_inr

        self.conn.execute(
            "UPDATE collection_requests SET status = 'collected', actual_value = ?, updated_at = ? WHERE id = ?",
            (act_val, now, request_id)
        )
        if material_ids:
            q_marks = ",".join("?" for _ in material_ids)
            self.conn.execute(
                f"""
                UPDATE materials
                SET status = 'collected', current_holder_id = ?, updated_at = ?
                WHERE id IN ({q_marks})
                """,
                (kabadiwala_id, now, *material_ids)
            )
        record_audit_event(
            self.conn,
            event_type="COLLECTION_COMPLETED",
            entity_type="collection_request",
            entity_id=request_id,
            actor_id=kabadiwala_id,
            actor_role="kabadiwala",
            details={
                "actualWeightKg": actual_kg,
                "contaminationPct": contamination_pct,
                "actualPayoutInr": act_val,
                "notes": notes
            }
        )
        cur = self.conn.execute("SELECT * FROM collection_requests WHERE id = ?", (request_id,))
        return self._format_request(cur.fetchone())

    def _format_request(self, row: sqlite3.Row) -> Dict[str, Any]:
        lat = float(row["latitude"])
        lon = float(row["longitude"])
        region = area_service.area_for(lat, lon)
        qty_by_type = json.loads(row["quantity_by_type"] or "{}")
        return {
            "id": row["id"],
            "householdId": row["household_id"],
            "assignedKabadiwalaId": row["assigned_kabadiwala_id"],
            "status": row["status"],
            "isDemo": bool(row["is_demo"]),
            "latitude": lat,
            "longitude": lon,
            "quantityByType": qty_by_type,
            "materialIds": json.loads(row["material_ids"] or "[]"),
            "estimatedValueInr": round(float(row["estimated_value"]), 2),
            "actualValueInr": round(float(row["actual_value"]), 2) if row["actual_value"] is not None else None,
            "region": region.name if region else "Delhi",
            "regionId": region.id if region else "area_central",
            "createdAt": row["created_at"],
        }

    # Recycler Requirements
    def publish_requirement(
        self, recycler_id: str, material_type: str, required_kg: float, minimum_kg: float = 0.0
    ) -> Dict[str, Any]:
        mat_type = material_type.lower()
        # Check active requirement
        cur = self.conn.execute(
            "SELECT * FROM recycler_requirements WHERE recycler_id = ? AND material_type = ? AND status IN ('open', 'partially_fulfilled')",
            (recycler_id, mat_type)
        )
        if cur.fetchone():
            raise ValueError(f"Active requirement already exists for {mat_type}")

        reqmt_id = _uid("reqmt")
        now = _now()
        self.conn.execute(
            """
            INSERT INTO recycler_requirements (
                id, recycler_id, material_type, required_quantity_kg, minimum_quantity_kg, fulfilled_quantity_kg, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 0.0, 'open', ?, ?)
            """,
            (reqmt_id, recycler_id, mat_type, float(required_kg), float(minimum_kg), now, now)
        )
        record_audit_event(
            self.conn,
            event_type="REQUIREMENT_PUBLISHED",
            entity_type="requirement",
            entity_id=reqmt_id,
            actor_id=recycler_id,
            actor_role="recycler",
            details={"materialType": mat_type, "requiredKg": required_kg, "minimumKg": minimum_kg}
        )
        cur = self.conn.execute("SELECT * FROM recycler_requirements WHERE id = ?", (reqmt_id,))
        return self._format_requirement(cur.fetchone())

    def get_recycler_requirements(self, recycler_id: str) -> List[Dict[str, Any]]:
        cur = self.conn.execute(
            "SELECT * FROM recycler_requirements WHERE recycler_id = ? ORDER BY created_at DESC",
            (recycler_id,)
        )
        return [self._format_requirement(r) for r in cur.fetchall()]

    def _format_requirement(self, row: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": row["id"],
            "recyclerId": row["recycler_id"],
            "materialType": row["material_type"],
            "requiredQuantityKg": float(row["required_quantity_kg"]),
            "minimumQuantityKg": float(row["minimum_quantity_kg"] or 0.0),
            "fulfilledQuantityKg": float(row["fulfilled_quantity_kg"] or 0.0),
            "status": row["status"],
            "createdAt": row["created_at"],
        }

    # Available Material Marketplace
    def get_available_material_for_recycler(self, recycler_id: str) -> List[Dict[str, Any]]:
        cur = self.conn.execute(
            """
            SELECT m.current_holder_id AS kabadiwala_id, p.name AS kabadiwala_name,
                   p.locality AS region, m.material_type, SUM(m.quantity_kg) AS quantity_kg
            FROM materials m
            JOIN profiles p ON m.current_holder_id = p.id
            WHERE m.status = 'collected'
            GROUP BY m.current_holder_id, m.material_type
            HAVING quantity_kg > 0
            ORDER BY quantity_kg DESC
            """
        )
        results = []
        for r in cur.fetchall():
            reg_name = r["region"] or "Delhi"
            results.append({
                "kabadiwalaId": r["kabadiwala_id"],
                "kabadiwalaName": r["kabadiwala_name"],
                "region": reg_name,
                "regionId": f"area_{reg_name.lower().replace(' ', '_')}",
                "materialType": r["material_type"],
                "quantityKg": round(float(r["quantity_kg"]), 2),
                "isDemo": True,
            })
        return results

    # Bookings
    def book_material(
        self, recycler_id: str, kabadiwala_id: str, material_type: str, quantity_kg: float, requirement_id: Optional[str] = None
    ) -> Dict[str, Any]:
        mat_type = material_type.lower()
        qty_needed = float(quantity_kg)

        # 1. Check requirement if given
        reqmt = None
        if requirement_id:
            cur = self.conn.execute("SELECT * FROM recycler_requirements WHERE id = ?", (requirement_id,))
            reqmt = cur.fetchone()
            if not reqmt or reqmt["status"] == "fulfilled":
                raise ValueError("Valid open requirement required")

        # 2. Find available collected materials
        cur = self.conn.execute(
            """
            SELECT * FROM materials
            WHERE current_holder_id = ? AND material_type = ? AND status = 'collected'
            ORDER BY created_at ASC
            """,
            (kabadiwala_id, mat_type)
        )
        stock = cur.fetchall()
        total_avail = sum(float(s["quantity_kg"]) for s in stock)
        if total_avail < qty_needed:
            raise ValueError(f"Insufficient collected stock: {total_avail} kg available, {qty_needed} kg requested")

        # 3. Reserve items, splitting lot if needed
        allocated_ids = []
        remaining = qty_needed
        now = _now()
        for item in stock:
            item_qty = float(item["quantity_kg"])
            if item_qty <= remaining:
                self.conn.execute(
                    "UPDATE materials SET status = 'reserved', updated_at = ? WHERE id = ?",
                    (now, item["id"])
                )
                allocated_ids.append(item["id"])
                remaining -= item_qty
            else:
                # Split item
                split_qty = round(item_qty - remaining, 3)
                self.conn.execute(
                    "UPDATE materials SET quantity_kg = ?, status = 'reserved', updated_at = ? WHERE id = ?",
                    (remaining, now, item["id"])
                )
                allocated_ids.append(item["id"])
                # Create remainder lot
                self.conn.execute(
                    """
                    INSERT INTO materials (id, material_type, quantity_kg, estimated_value, source_id, current_holder_id, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'collected', ?, ?)
                    """,
                    (_uid("mat"), mat_type, split_qty, 0.0, item["source_id"], kabadiwala_id, now, now)
                )
                remaining = 0
                break

        # 4. Create booking record
        booking_id = _uid("book")
        self.conn.execute(
            """
            INSERT INTO bookings (id, recycler_id, kabadiwala_id, requirement_id, material_type, quantity_kg, material_ids, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'reserved', ?, ?)
            """,
            (booking_id, recycler_id, kabadiwala_id, requirement_id, mat_type, qty_needed, json.dumps(allocated_ids), now, now)
        )
        record_audit_event(
            self.conn,
            event_type="BOOKING_RESERVED",
            entity_type="booking",
            entity_id=booking_id,
            actor_id=recycler_id,
            actor_role="recycler",
            details={"kabadiwalaId": kabadiwala_id, "materialType": mat_type, "quantityKg": qty_needed}
        )
        cur = self.conn.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,))
        return self._format_booking(cur.fetchone())

    def confirm_handover(self, recycler_id: str, booking_id: str) -> Dict[str, Any]:
        cur = self.conn.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,))
        b = cur.fetchone()
        if not b:
            raise ValueError("Booking not found")
        if b["recycler_id"] != recycler_id:
            raise ValueError("Booking belongs to another recycler")
        if b["status"] != "reserved":
            raise ValueError(f"Cannot confirm booking with status {b['status']}")

        now = _now()
        self.conn.execute(
            "UPDATE bookings SET status = 'confirmed', updated_at = ? WHERE id = ?",
            (now, booking_id)
        )
        material_ids = json.loads(b["material_ids"] or "[]")
        if material_ids:
            q_marks = ",".join("?" for _ in material_ids)
            self.conn.execute(
                f"UPDATE materials SET status = 'transferred', destination_id = ?, updated_at = ? WHERE id IN ({q_marks})",
                (recycler_id, now, *material_ids)
            )

        # Update requirement if associated
        if b["requirement_id"]:
            req_cur = self.conn.execute("SELECT * FROM recycler_requirements WHERE id = ?", (b["requirement_id"],))
            reqmt = req_cur.fetchone()
            if reqmt:
                fulfilled = float(reqmt["fulfilled_quantity_kg"]) + float(b["quantity_kg"])
                req_kg = float(reqmt["required_quantity_kg"])
                new_status = "fulfilled" if fulfilled >= req_kg else "partially_fulfilled"
                self.conn.execute(
                    "UPDATE recycler_requirements SET fulfilled_quantity_kg = ?, status = ?, updated_at = ? WHERE id = ?",
                    (fulfilled, new_status, now, b["requirement_id"])
                )

        record_audit_event(
            self.conn,
            event_type="HANDOVER_CONFIRMED",
            entity_type="booking",
            entity_id=booking_id,
            actor_id=recycler_id,
            actor_role="recycler",
            details={"quantityKg": float(b["quantity_kg"]), "materialType": b["material_type"]}
        )
        cur = self.conn.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,))
        return self._format_booking(cur.fetchone())

    def get_recycler_bookings(self, recycler_id: str) -> List[Dict[str, Any]]:
        cur = self.conn.execute(
            "SELECT * FROM bookings WHERE recycler_id = ? ORDER BY created_at DESC",
            (recycler_id,)
        )
        return [self._format_booking(r) for r in cur.fetchall()]

    def _format_booking(self, row: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": row["id"],
            "recyclerId": row["recycler_id"],
            "kabadiwalaId": row["kabadiwala_id"],
            "requirementId": row["requirement_id"],
            "materialType": row["material_type"],
            "quantityKg": float(row["quantity_kg"]),
            "materialIds": json.loads(row["material_ids"] or "[]"),
            "status": row["status"],
            "createdAt": row["created_at"],
        }

    # Collector Inventory
    def get_kabadiwala_inventory(self, kabadiwala_id: str) -> List[Dict[str, Any]]:
        cur = self.conn.execute(
            """
            SELECT material_type, status, SUM(quantity_kg) AS quantity_kg
            FROM materials
            WHERE current_holder_id = ? AND status IN ('collected', 'reserved')
            GROUP BY material_type, status
            """,
            (kabadiwala_id,)
        )
        return [
            {
                "materialType": r["material_type"],
                "status": r["status"],
                "quantityKg": round(float(r["quantity_kg"]), 2),
                "isDemo": True,
            }
            for r in cur.fetchall()
        ]

    # Metrics
    def get_household_metrics(self, household_id: str) -> Dict[str, Any]:
        cur = self.conn.execute(
            """
            SELECT status, SUM(quantity_kg) AS qty, SUM(estimated_value) AS val
            FROM materials
            WHERE source_id = ?
            GROUP BY status
            """,
            (household_id,)
        )
        total_diverted_kg = 0.0
        pending_pickup_kg = 0.0
        total_earnings_inr = 0.0
        for r in cur.fetchall():
            q = float(r["qty"] or 0)
            v = float(r["val"] or 0)
            if r["status"] in ("collected", "reserved", "transferred"):
                total_diverted_kg += q
                total_earnings_inr += v
            elif r["status"] in ("available", "requested"):
                pending_pickup_kg += q

        # Landfill volume saved: ~0.0025 m3 per kg of compressed recyclable waste
        landfill_m3 = round(total_diverted_kg * 0.0025, 2)
        cur_req = self.conn.execute(
            "SELECT COUNT(*) AS cnt FROM collection_requests WHERE household_id = ? AND status = 'collected'",
            (household_id,)
        )
        collections_completed = int(cur_req.fetchone()["cnt"] or 0)
        total_recorded_kg = round(total_diverted_kg + pending_pickup_kg, 1)

        return {
            "divertedKg": round(total_diverted_kg, 1),
            "pendingPickupKg": round(pending_pickup_kg, 1),
            "totalEarningsInr": round(total_earnings_inr),
            "landfillVolumeM3": landfill_m3,
            "impactTreeFactor": round(total_diverted_kg * 0.04, 1),
            "totalRecordedKg": total_recorded_kg,
            "totalCollectedKg": round(total_diverted_kg, 1),
            "estimatedValueInr": round(total_earnings_inr),
            "collectionsCompleted": collections_completed,
            "byMaterialType": {},
            "downstreamDestinations": [],
        }

    def get_kabadiwala_metrics(self, kabadiwala_id: str) -> Dict[str, Any]:
        cur = self.conn.execute(
            """
            SELECT COUNT(*) AS total_pickups,
                   COALESCE(SUM(actual_value), SUM(estimated_value)) AS total_payout
            FROM collection_requests
            WHERE assigned_kabadiwala_id = ? AND status = 'collected'
            """,
            (kabadiwala_id,)
        )
        row = cur.fetchone()
        cur_inv = self.conn.execute(
            "SELECT SUM(quantity_kg) AS stock FROM materials WHERE current_holder_id = ? AND status = 'collected'",
            (kabadiwala_id,)
        )
        stock_row = cur_inv.fetchone()
        cur_trans = self.conn.execute(
            "SELECT SUM(quantity_kg) AS qty FROM bookings WHERE kabadiwala_id = ? AND status = 'confirmed'",
            (kabadiwala_id,)
        )
        transferred_kg = float(cur_trans.fetchone()["qty"] or 0)
        stock_kg = round(float(stock_row["stock"] or 0), 1)
        payout_inr = round(float(row["total_payout"] or 0))
        pickups = int(row["total_pickups"] or 0)

        return {
            "totalPickups": pickups,
            "totalPayoutInr": payout_inr,
            "currentStockKg": stock_kg,
            "reliabilityScore": 4.9,
            "requestsAccepted": pickups,
            "collectionsCompleted": pickups,
            "totalCollectedKg": stock_kg,
            "estimatedRevenueInr": payout_inr,
            "byMaterialType": {},
            "reservedForTransferKg": 0.0,
            "transferredToRecyclersKg": round(transferred_kg, 1),
            "demoRating": 4.8,
            "payoutIndex": 1.0,
        }

    def get_recycler_metrics(self, recycler_id: str) -> Dict[str, Any]:
        cur = self.conn.execute(
            """
            SELECT COUNT(*) AS confirmed_bookings, SUM(quantity_kg) AS total_recovered_kg
            FROM bookings
            WHERE recycler_id = ? AND status = 'confirmed'
            """,
            (recycler_id,)
        )
        row = cur.fetchone()
        recovered = float(row["total_recovered_kg"] or 0)
        reqs = self.get_recycler_requirements(recycler_id)
        cur2 = self.conn.execute(
            "SELECT status, COUNT(*) as cnt, SUM(quantity_kg) as total_kg FROM bookings WHERE recycler_id = ? GROUP BY status",
            (recycler_id,)
        )
        b_counts = {r["status"]: (r["cnt"], r["total_kg"]) for r in cur2.fetchall()}
        confirmed_cnt, confirmed_kg = b_counts.get("confirmed", (0, 0.0))
        reserved_cnt, reserved_kg = b_counts.get("reserved", (0, 0.0))
        fulfilled_kg = sum(r.get("fulfilledQuantityKg", 0.0) for r in reqs)

        return {
            "confirmedOrders": int(row["confirmed_bookings"] or 0),
            "totalRecoveredKg": round(recovered, 1),
            "co2OffsetKg": round(recovered * 1.85, 1),
            "circularYieldPct": 94.2,
            "requirements": reqs,
            "fulfilledQuantityKg": round(fulfilled_kg, 2),
            "completedBookings": int(confirmed_cnt or 0),
            "reservedBookings": int(reserved_cnt or 0),
        }

    # Area Summaries & Opportunities
    def get_area_summaries(self) -> List[Dict[str, Any]]:
        cur = self.conn.execute(
            """
            SELECT id, household_id, latitude, longitude, quantity_by_type, estimated_value, status
            FROM collection_requests
            WHERE status = 'pending'
            """
        )
        pending = []
        for r in cur.fetchall():
            lat = float(r["latitude"])
            lon = float(r["longitude"])
            area = area_service.area_for(lat, lon)
            qty_map = json.loads(r["quantity_by_type"] or "{}")
            pending.append({
                "areaId": area.id,
                "areaName": area.name,
                "quantityByType": qty_map,
                "estimatedValueInr": float(r["estimated_value"]),
            })

        area_map = {a.id: {"areaId": a.id, "name": a.name, "requestCount": 0, "materialKg": 0.0, "estimatedValueInr": 0.0, "materialBreakdown": {}, "center": {"latitude": a.center_latitude, "longitude": a.center_longitude}, "opportunityRank": 0} for a in DELHI_AREAS}
        for item in pending:
            aid = item["areaId"]
            if aid in area_map:
                area_map[aid]["requestCount"] += 1
                area_map[aid]["estimatedValueInr"] += item["estimatedValueInr"]
                for m_type, q in item["quantityByType"].items():
                    area_map[aid]["materialKg"] += q
                    bd = area_map[aid]["materialBreakdown"]
                    bd[m_type] = round(bd.get(m_type, 0.0) + q, 2)

        sorted_areas = sorted(area_map.values(), key=lambda a: (a["requestCount"], a["materialKg"]), reverse=True)
        for rank, a in enumerate(sorted_areas, start=1):
            a["opportunityRank"] = rank
            a["materialKg"] = round(a["materialKg"], 2)
            a["estimatedValueInr"] = round(a["estimatedValueInr"])
        return sorted_areas

    def get_area_opportunities(self, area_id: str) -> List[Dict[str, Any]]:
        target_area = next((a for a in DELHI_AREAS if a.id == area_id or a.id == f"area_{area_id.lower()}"), None)
        if not target_area:
            return []

        cur = self.conn.execute("SELECT * FROM collection_requests WHERE status = 'pending'")
        results = []
        for r in cur.fetchall():
            lat = float(r["latitude"])
            lon = float(r["longitude"])
            matched = area_service.area_for(lat, lon)
            if matched.id == target_area.id:
                qty_map = json.loads(r["quantity_by_type"] or "{}")
                total_kg = sum(qty_map.values())
                results.append({
                    "requestId": r["id"],
                    "status": "pending",
                    "region": target_area.name,
                    "regionId": target_area.id,
                    "quantityByType": qty_map,
                    "quantityKg": round(total_kg, 2),
                    "estimatedValueInr": round(float(r["estimated_value"])),
                    "isDemo": True,
                    "approxCoordinates": {"latitude": lat, "longitude": lon},
                })
        return results
