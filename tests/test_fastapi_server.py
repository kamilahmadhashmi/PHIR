"""Comprehensive automated test suite for PHIR Unified FastAPI + SQLite Relational Stack.
"""

from __future__ import annotations

import os
import unittest
from pathlib import Path
from fastapi.testclient import TestClient

# Use a clean temporary SQLite database for test isolation
TEST_DB_PATH = Path(__file__).resolve().parent / "test_phir.db"
os.environ["PHIR_DB_PATH"] = str(TEST_DB_PATH)

from src.main import app
from src.database import init_db, get_db
from src.repository import SqliteRecoveryRepository


class FastApiServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if TEST_DB_PATH.exists():
            TEST_DB_PATH.unlink()
        init_db(TEST_DB_PATH)
        with get_db(TEST_DB_PATH) as conn:
            repo = SqliteRecoveryRepository(conn)
            repo.seed_initial_data()
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        if TEST_DB_PATH.exists():
            try:
                TEST_DB_PATH.unlink()
            except OSError:
                pass

    def test_01_health_and_docs(self):
        resp = self.client.get("/healthz")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["cost"], "₹0")

        resp = self.client.get("/api/status")
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json()["cloudDependency"])

    def test_02_static_frontend_serving(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("text/html", resp.headers["content-type"])
        self.assertIn("Phir", resp.text)

        # Test dynamic config JS
        resp = self.client.get("/phir-config.js")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("window.PHIR_API_BASE", resp.text)

        # Test multilingual i18n bundle
        resp = self.client.get("/phir-i18n.js")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("PHIR_I18N", resp.text)

        # Test enhancements bundle
        resp = self.client.get("/phir-enhancements.js")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("phirOpenMandiRates", resp.text)

    def test_03_household_lifecycle(self):
        # 1. Add material
        add_resp = self.client.post("/api/materials", json={
            "userId": "household_1",
            "materialType": "pet",
            "quantityKg": 8.5
        })
        self.assertEqual(add_resp.status_code, 201)
        mat = add_resp.json()
        mat_id = mat["id"]
        self.assertEqual(mat["materialType"], "pet")
        self.assertEqual(mat["quantityKg"], 8.5)
        self.assertGreater(mat["estimatedValueInr"], 0)

        # 2. Update material
        up_resp = self.client.put(f"/api/materials/{mat_id}", json={
            "userId": "household_1",
            "quantityKg": 10.0
        })
        self.assertEqual(up_resp.status_code, 200)
        self.assertEqual(up_resp.json()["quantityKg"], 10.0)

        # 3. Create collection request
        req_resp = self.client.post("/api/collection-requests", json={
            "householdId": "household_1"
        })
        self.assertEqual(req_resp.status_code, 201)
        req = req_resp.json()
        req_id = req["id"]
        self.assertEqual(req["status"], "pending")

        # 4. Duplicate request prevention
        dup_resp = self.client.post("/api/collection-requests", json={
            "householdId": "household_1"
        })
        self.assertEqual(dup_resp.status_code, 400)

        # 5. Check dashboard
        dash_resp = self.client.get("/api/v1/households/household_1/dashboard")
        self.assertEqual(dash_resp.status_code, 200)
        dash = dash_resp.json()
        self.assertEqual(dash["activeRequest"]["id"], req_id)
        self.assertIn("divertedKg", dash["metrics"])

    def test_04_collector_lifecycle_and_reconciliation(self):
        # 1. Check areas
        areas_resp = self.client.get("/api/kabadiwalas/kabadiwala_1/areas")
        self.assertEqual(areas_resp.status_code, 200)
        areas = areas_resp.json()["areas"]
        self.assertGreater(len(areas), 0)

        # 2. Accept request from test_03
        req_id = self.client.get("/api/households/household_1/requests").json()["request"]["id"]
        acc_resp = self.client.post(f"/api/collection-requests/{req_id}/accept", json={
            "kabadiwalaId": "kabadiwala_1"
        })
        self.assertEqual(acc_resp.status_code, 200)
        self.assertEqual(acc_resp.json()["status"], "accepted")

        # 3. Complete collection with physical weight reconciliation and 5% contamination
        col_resp = self.client.post(f"/api/collection-requests/{req_id}/collect", json={
            "kabadiwalaId": "kabadiwala_1",
            "actualKg": 25.0,
            "contaminationPct": 5.0,
            "notes": "Slight moisture on cardboard"
        })
        self.assertEqual(col_resp.status_code, 200)
        col = col_resp.json()
        self.assertEqual(col["status"], "collected")
        self.assertIsNotNone(col["actualValueInr"])

        # 4. Check collector inventory and metrics
        inv_resp = self.client.get("/api/kabadiwalas/kabadiwala_1/inventory")
        self.assertEqual(inv_resp.status_code, 200)
        self.assertGreater(len(inv_resp.json()["inventory"]), 0)

        met_resp = self.client.get("/api/kabadiwalas/kabadiwala_1/metrics")
        self.assertEqual(met_resp.status_code, 200)
        self.assertGreaterEqual(met_resp.json()["totalPickups"], 1)

    def test_05_recycler_marketplace_and_lot_splitting(self):
        # 1. Publish requirement
        pub_resp = self.client.post("/api/recycler-requirements", json={
            "recyclerId": "recycler_1",
            "materialType": "cardboard",
            "requiredQuantityKg": 50.0,
            "minimumQuantityKg": 10.0
        })
        self.assertEqual(pub_resp.status_code, 201)
        reqmt = pub_resp.json()
        reqmt_id = reqmt["id"]

        # 2. Check available material
        avail_resp = self.client.get("/api/recyclers/recycler_1/available-material")
        self.assertEqual(avail_resp.status_code, 200)
        avail = avail_resp.json()["availableMaterial"]
        cardboard_lot = next((a for a in avail if a["materialType"] == "cardboard" and a["kabadiwalaId"] == "kabadiwala_1"), None)
        self.assertIsNotNone(cardboard_lot)

        # 3. Book partial quantity (lot splitting)
        book_resp = self.client.post("/api/bookings", json={
            "recyclerId": "recycler_1",
            "kabadiwalaId": "kabadiwala_1",
            "materialType": "cardboard",
            "quantityKg": 20.0,
            "requirementId": reqmt_id
        })
        self.assertEqual(book_resp.status_code, 201)
        booking = book_resp.json()
        booking_id = booking["id"]
        self.assertEqual(booking["status"], "reserved")
        self.assertEqual(booking["quantityKg"], 20.0)

        # 4. Confirm handover
        conf_resp = self.client.post(f"/api/bookings/{booking_id}/confirm", json={
            "recyclerId": "recycler_1"
        })
        self.assertEqual(conf_resp.status_code, 200)
        self.assertEqual(conf_resp.json()["status"], "confirmed")

        # 5. Check recycler dashboard
        dash_resp = self.client.get("/api/v1/recyclers/recycler_1/dashboard")
        self.assertEqual(dash_resp.status_code, 200)
        dash = dash_resp.json()
        self.assertGreaterEqual(dash["metrics"]["confirmedOrders"], 1)
        self.assertGreater(dash["metrics"]["totalRecoveredKg"], 0)

    def test_06_epr_audit_ledger(self):
        req = self.client.get("/api/households/household_1/requests").json()["request"]
        req_id = req["id"]
        audit_resp = self.client.get(f"/api/v1/audit/{req_id}")
        self.assertEqual(audit_resp.status_code, 200)
        events = audit_resp.json()["events"]
        self.assertGreaterEqual(len(events), 2)
        event_types = [e["eventType"] for e in events]
        self.assertIn("REQUEST_CREATED", event_types)
        self.assertIn("COLLECTION_COMPLETED", event_types)
        # Verify cryptographic hash presence
        for e in events:
            self.assertEqual(len(e["verificationHash"]), 64)

    def test_07_collection_request_cancellation(self):
        test_hh = "household_test_cancel"
        # Add material
        add_resp = self.client.post("/api/materials", json={
            "userId": test_hh,
            "materialType": "glass",
            "quantityKg": 5.0
        })
        self.assertEqual(add_resp.status_code, 201)

        # Create request
        req_resp = self.client.post("/api/collection-requests", json={
            "householdId": test_hh
        })
        self.assertEqual(req_resp.status_code, 201)
        req_id = req_resp.json()["id"]

        # Cancel request
        cancel_resp = self.client.post(f"/api/collection-requests/{req_id}/cancel", json={
            "householdId": test_hh
        })
        self.assertEqual(cancel_resp.status_code, 200)
        self.assertEqual(cancel_resp.json()["status"], "cancelled")

        # Materials should be available again
        inv_resp = self.client.get(f"/api/households/{test_hh}/inventory")
        self.assertEqual(inv_resp.status_code, 200)
        materials = inv_resp.json()["inventory"]
        self.assertTrue(any(m["materialType"] == "glass" and m["status"] == "available" for m in materials))

        # Active request should now be null
        req_check = self.client.get(f"/api/households/{test_hh}/collection-request")
        self.assertEqual(req_check.status_code, 200)
        self.assertIsNone(req_check.json()["request"])


if __name__ == "__main__":
    unittest.main()
