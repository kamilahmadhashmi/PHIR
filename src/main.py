"""Unified FastAPI Production Application for PHIR.

Provides zero-cost, high-performance async REST APIs, OpenAPI interactive docs,
and serves the rich truck-art folk frontend seamlessly with zero cloud dependencies.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .audit_ledger import get_audit_trail
from .database import get_db, init_db
from .rate_engine import DEFAULT_MANDI_RATES, RateEngine
from .repository import SqliteRecoveryRepository
from .route_planner import plan_preview
from .schemas import (
    BookingConfirm,
    BookingCreate,
    ClassifyImageResponse,
    CollectionAccept,
    CollectionComplete,
    CollectionRequestCreate,
    ImageDetection,
    MaterialCreate,
    MaterialDelete,
    MaterialUpdate,
    ProfileCreate,
    RequirementCreate,
)

ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT / "frontend" / "amplify-site"
rate_engine = RateEngine()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed initial data
    init_db()
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        repo.seed_initial_data()
    yield


app = FastAPI(
    title="PHIR Resource Recovery Platform",
    description="Decoupled, zero-cost environmental recovery API connecting households, collection partners, and recyclers.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- System & Diagnostic Endpoints ---
@app.get("/healthz", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "phir-api", "version": "2.0.0", "cost": "₹0"}


@app.get("/api/status", tags=["System"])
def api_status():
    return {
        "status": "online",
        "engine": "FastAPI + SQLite WAL",
        "cloudDependency": False,
        "docsUrl": "/docs"
    }


# --- Profiles & Identity ---
@app.get("/api/demo/users", tags=["Profiles"])
def list_demo_users():
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        profiles = repo.list_profiles()
        return {"users": [{"id": p["id"], "role": p["role"], "name": p["name"]} for p in profiles]}


@app.get("/api/households/{household_id}/profile", tags=["Profiles"])
@app.get("/api/kabadiwalas/{collector_id}/profile", tags=["Profiles"])
@app.get("/api/recyclers/{recycler_id}/profile", tags=["Profiles"])
def get_user_profile(household_id: Optional[str] = None, collector_id: Optional[str] = None, recycler_id: Optional[str] = None):
    p_id = household_id or collector_id or recycler_id
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        p = repo.get_profile(p_id)
        if not p:
            raise HTTPException(status_code=404, detail="Profile not found")
        return p


@app.post("/api/demo/profiles", status_code=status.HTTP_201_CREATED, tags=["Profiles"])
def create_demo_profile(payload: ProfileCreate):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        profile = repo.create_or_update_profile(payload.model_dump())
        return profile


# --- Household Material Endpoints ---
@app.get("/api/households/{household_id}/inventory", tags=["Household"])
def get_household_inventory(household_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        materials = repo.get_household_materials(household_id)
        return materials


@app.post("/api/materials", status_code=status.HTTP_201_CREATED, tags=["Household"])
def add_household_material(payload: MaterialCreate):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            mat = repo.add_material(payload.userId, payload.materialType, payload.quantityKg)
            return mat
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.put("/api/materials/{material_id}", tags=["Household"])
def update_household_material(material_id: str, payload: MaterialUpdate):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            mat = repo.update_material(payload.userId, material_id, payload.quantityKg)
            return mat
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.delete("/api/materials/{material_id}", tags=["Household"])
def delete_household_material(material_id: str, payload: MaterialDelete):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            repo.remove_material(payload.userId, material_id)
            return {"ok": True}
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/households/{household_id}/requests", tags=["Household"])
def get_household_request(household_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        req = repo.get_household_request(household_id)
        return {"request": req}


@app.post("/api/collection-requests", status_code=status.HTTP_201_CREATED, tags=["Household"])
def create_collection_request(payload: CollectionRequestCreate):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            req = repo.create_collection_request(payload.householdId, payload.materialIds)
            return req
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/households/{household_id}/metrics", tags=["Household"])
def get_household_metrics(household_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return repo.get_household_metrics(household_id)


# --- Kabadiwala / Collector Endpoints ---
@app.get("/api/kabadiwalas/{collector_id}/areas", tags=["Collector"])
@app.get("/api/demo/areas", tags=["Collector"])
def get_collector_areas(collector_id: Optional[str] = None):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        areas = repo.get_area_summaries()
        total_open = sum(a["requestCount"] for a in areas)
        return {
            "areas": areas,
            "requestSummary": {"total": total_open, "open": total_open, "inProgress": 0}
        }


@app.get("/api/kabadiwalas/{collector_id}/areas/{area_id}/opportunities", tags=["Collector"])
def get_collector_area_opportunities(collector_id: str, area_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        opportunities = repo.get_area_opportunities(area_id)
        return {"opportunities": opportunities}


@app.get("/api/kabadiwalas/{collector_id}/requests", tags=["Collector"])
def get_collector_requests(collector_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        cur = conn.execute(
            """
            SELECT * FROM collection_requests
            WHERE assigned_kabadiwala_id = ? OR status = 'pending'
            ORDER BY created_at DESC
            """,
            (collector_id,)
        )
        return {"requests": [repo._format_request(r) for r in cur.fetchall()]}


@app.post("/api/collection-requests/{request_id}/accept", tags=["Collector"])
def accept_request(request_id: str, payload: CollectionAccept):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            req = repo.accept_collection_request(payload.kabadiwalaId, request_id)
            return req
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/collection-requests/{request_id}/reject", tags=["Collector"])
def reject_request(request_id: str, payload: CollectionAccept):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            req = repo.reject_collection_request(payload.kabadiwalaId, request_id)
            return req
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/collection-requests/{request_id}/collect", tags=["Collector"])
def complete_collection(request_id: str, payload: CollectionComplete):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            req = repo.complete_collection(
                payload.kabadiwalaId,
                request_id,
                actual_kg=payload.actualKg,
                contamination_pct=payload.contaminationPct or 0.0,
                notes=payload.notes,
            )
            return req
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/kabadiwalas/{collector_id}/inventory", tags=["Collector"])
def get_collector_inventory(collector_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return {"inventory": repo.get_kabadiwala_inventory(collector_id)}


@app.get("/api/kabadiwalas/{collector_id}/metrics", tags=["Collector"])
def get_collector_metrics(collector_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return repo.get_kabadiwala_metrics(collector_id)


@app.post("/api/kabadiwalas/{collector_id}/route", tags=["Collector"])
def calculate_route_preview(collector_id: str, payload: Dict[str, Any]):
    stops = payload.get("stops", [])
    preview = plan_preview(stops)
    return {"route": preview}


# --- Recycler Marketplace Endpoints ---
@app.get("/api/recyclers/{recycler_id}/requirements", tags=["Recycler"])
def get_recycler_requirements(recycler_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return {"requirements": repo.get_recycler_requirements(recycler_id)}


@app.post("/api/recycler-requirements", status_code=status.HTTP_201_CREATED, tags=["Recycler"])
def publish_requirement(payload: RequirementCreate):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            reqmt = repo.publish_requirement(payload.recyclerId, payload.materialType, payload.requiredQuantityKg, payload.minimumQuantityKg)
            return reqmt
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/recyclers/{recycler_id}/available-material", tags=["Recycler"])
def get_available_material(recycler_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return {"availableMaterial": repo.get_available_material_for_recycler(recycler_id)}


@app.post("/api/bookings", status_code=status.HTTP_201_CREATED, tags=["Recycler"])
def create_booking(payload: BookingCreate):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            b = repo.book_material(payload.recyclerId, payload.kabadiwalaId, payload.materialType, payload.quantityKg, payload.requirementId)
            return b
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/bookings/{booking_id}/confirm", tags=["Recycler"])
def confirm_booking(booking_id: str, payload: BookingConfirm):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        try:
            b = repo.confirm_handover(payload.recyclerId, booking_id)
            return b
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/recyclers/{recycler_id}/bookings", tags=["Recycler"])
def get_recycler_bookings(recycler_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return {"bookings": repo.get_recycler_bookings(recycler_id)}


@app.get("/api/recyclers/{recycler_id}/metrics", tags=["Recycler"])
def get_recycler_metrics(recycler_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        return repo.get_recycler_metrics(recycler_id)


# --- Vision / Classification Endpoint ---
@app.post("/api/classify-image", tags=["Vision"])
def classify_image(payload: Dict[str, Any]):
    filename = str(payload.get("filename", "")).lower()
    materials = ["pet", "cardboard", "paper", "aluminium", "glass"]
    detected = next((m for m in materials if m in filename or (m == "pet" and "plastic" in filename)), None)
    if not detected:
        detected = materials[sum(filename.encode("utf-8")) % len(materials)] if filename else "paper"
    return {
        "detections": [{"materialType": detected, "confidence": 0.94, "requiresConfirmation": True}],
        "mode": "demo",
    }


# --- Consolidated V1 Dashboards & Audit Trail ---
@app.get("/api/v1/households/{household_id}/dashboard", tags=["V1 Dashboards"])
def get_household_dashboard(household_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        profile = repo.get_profile(household_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        inventory = repo.get_household_materials(household_id)
        active_req = repo.get_household_request(household_id)
        metrics = repo.get_household_metrics(household_id)
        return {
            "profile": profile,
            "inventory": inventory,
            "activeRequest": active_req,
            "metrics": metrics,
            "rates": DEFAULT_MANDI_RATES,
        }


@app.get("/api/v1/collectors/{collector_id}/dashboard", tags=["V1 Dashboards"])
def get_collector_dashboard(collector_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        profile = repo.get_profile(collector_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        areas = repo.get_area_summaries()
        inv = repo.get_kabadiwala_inventory(collector_id)
        metrics = repo.get_kabadiwala_metrics(collector_id)
        cur = conn.execute(
            "SELECT * FROM collection_requests WHERE assigned_kabadiwala_id = ? OR status = 'pending' ORDER BY created_at DESC",
            (collector_id,)
        )
        requests = [repo._format_request(r) for r in cur.fetchall()]
        return {
            "profile": profile,
            "areas": areas,
            "inventory": inv,
            "activeRequests": requests,
            "metrics": metrics,
        }


@app.get("/api/v1/recyclers/{recycler_id}/dashboard", tags=["V1 Dashboards"])
def get_recycler_dashboard(recycler_id: str):
    with get_db() as conn:
        repo = SqliteRecoveryRepository(conn)
        profile = repo.get_profile(recycler_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        requirements = repo.get_recycler_requirements(recycler_id)
        bookings = repo.get_recycler_bookings(recycler_id)
        available = repo.get_available_material_for_recycler(recycler_id)
        metrics = repo.get_recycler_metrics(recycler_id)
        return {
            "profile": profile,
            "requirements": requirements,
            "bookings": bookings,
            "availableMaterial": available,
            "metrics": metrics,
        }


@app.get("/api/v1/audit/{entity_id}", tags=["Audit"])
def get_entity_audit_trail(entity_id: str):
    with get_db() as conn:
        trail = get_audit_trail(conn, entity_id)
        return {"entityId": entity_id, "events": trail}


@app.get("/api/v1/rate-cards", tags=["Pricing"])
def get_rate_cards():
    return {"rates": DEFAULT_MANDI_RATES, "locality": "Delhi", "currency": "INR"}


# --- Serve Full Folk-Art Static Frontend ---
if FRONTEND_DIR.exists():
    app.mount("/media", StaticFiles(directory=str(FRONTEND_DIR / "media")), name="media")
    if (FRONTEND_DIR / "map").exists():
        app.mount("/map", StaticFiles(directory=str(FRONTEND_DIR / "map")), name="map")

    @app.get("/{filename}.js")
    def serve_js(filename: str):
        js_file = FRONTEND_DIR / f"{filename}.js"
        if js_file.exists():
            return FileResponse(js_file, media_type="application/javascript")
        raise HTTPException(status_code=404, detail="File not found")

    @app.get("/")
    def serve_index():
        return FileResponse(FRONTEND_DIR / "index.html", media_type="text/html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    print(f"Starting PHIR Unified Server at http://localhost:{port}")
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=False)
