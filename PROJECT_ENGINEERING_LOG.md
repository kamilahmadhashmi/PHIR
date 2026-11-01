# PHIR — Project Engineering & Architectural Log

This document records all architectural decisions, code refactoring, feature additions, dependency evaluations, and verification steps performed on **PHIR** under the autonomous engineering authority mandate.

---

## Baseline Initial State Audit
- **Repository Location:** `C:\Users\KIIT\.gemini\antigravity\scratch\PHIR`
- **Initial Commit:** `1e7e198` $\rightarrow$ `8b5a75c`
- **Legacy Architecture & Key Deficiencies:**
  1. **AWS Lock-in & Broken Endpoints:** Deployment relied on AWS API Gateway and Lambda returning HTTP 500 on data routes due to DynamoDB full-table snapshot rewrite concurrency bugs.
  2. **Disconnected Frontend:** The rich folk-art frontend in `frontend/amplify-site/` was hardcoded to an external API Gateway endpoint in `phir-config.js`. Running the local script (`run_demo.sh`) only served a crude 16KB mock test client (`demo/index.html`) rather than the actual application.
  3. **Absence of Real-World Scrap Mechanics:** Prices were hardcoded constants; there was no concept of physical scale weighing vs. household estimates, no contamination deduction, and no Extended Producer Responsibility (EPR) traceability.

---

## Engineering Entries

### [Log-001] AWS Hackathon Branding Removal
- **Objective:** Completely dissociate PHIR from hackathon promotional branding and establish it as an independent environmental resource recovery platform.
- **Actions:**
  - Renamed `frontend/backend-context/project_story_and_hackathon_context.md` to `project_story_and_context.md`.
  - Audited and updated 13 files across the codebase.
  - Verified 0 remaining branding occurrences.
  - All 32 legacy unit tests passed. Committed as `8b5a75c`.

---

### [Log-002] Zero-Cost Modern Architecture & Engine Implementation
- **Objective:** Deliver a production-grade, 100% free, reliable, and decoupled backend + unified frontend.
- **Zero-Cost Technology Decisions:**
  - **Framework:** **FastAPI + Uvicorn + Pydantic v2** (MIT license, high performance, self-documenting OpenAPI at `/docs`).
  - **Database:** **SQLite 3** configured with Write-Ahead Logging (`PRAGMA journal_mode=WAL`), foreign keys (`PRAGMA foreign_keys=ON`), and a 5-second busy timeout. Runs locally with zero memory overhead and zero external infrastructure, with relational schema parity for PostgreSQL.
  - **Static Web Host:** FastAPI serves `frontend/amplify-site/` at root `/` with static mounts for `/media/` and `/map/`.
  - **Configuration:** Updated `frontend/phir-config.js` and `frontend/amplify-site/phir-config.js` to dynamic relative resolution: `window.PHIR_API_BASE = window.PHIR_API_BASE || ''`.
- **New Modules Implemented:**
  1. `src/database.py`: Transactional SQLite connection manager and DDL schema.
  2. `src/rate_engine.py`: Dynamic Mandi scrap rate card engine providing market-aligned benchmarks for PET (₹15), Cardboard (₹12.5), Paper (₹9), Aluminium (₹110), Glass (₹4.5), Wood (₹3).
  3. `src/weight_reconciler.py`: Field scale reconciliation engine with contamination deduction ($0\text{--}100\%$) and net payout computation.
  4. `src/audit_ledger.py`: Tamper-evident, cryptographically hashed event ledger for Extended Producer Responsibility (EPR) compliance.
  5. `src/schemas.py`: Pydantic v2 validation models for all API requests and responses.
  6. `src/repository.py`: Relational data access layer with ACID transactions, atomic lot-splitting, and Delhi area spatial clustering.
  7. `src/main.py`: Unified FastAPI server providing full REST endpoints, Swagger UI at `/docs`, ReDoc at `/redoc`, health checks at `/healthz`, and static frontend delivery.
  8. `run.py`: Cross-platform entrypoint (`python run.py --port 8080`) starting the complete product in one command.
  9. `scripts/run_demo.sh`: Enhanced bash launcher that automatically detects FastAPI and executes `run.py`.

---

## Test Verification & Quality Assurance
- **Full Test Suite:** `python -m unittest discover -s tests -v`
- **Total Tests:** **38 tests** (32 legacy domain tests + 6 comprehensive FastAPI integration tests).
- **Execution Time:** 1.710 seconds.
- **Pass Rate:** **100% (38/38 passing)**.
- **Verified Workflows:**
  - Root `/` serves folk-art HTML; `/phir-config.js` serves dynamic configuration.
  - Household: material addition, quantity update, request creation, duplicate request blocking, and dashboard metrics.
  - Collector: area opportunities discovery, request acceptance, collection with physical scale weight reconciliation (25 kg actual vs estimate, 5% contamination deduction), and inventory aggregation.
  - Recycler: requirement publishing, available material marketplace discovery, partial booking with atomic inventory lot-splitting, and handover confirmation.
  - EPR Ledger: verified SHA-256 cryptographic digests generated for `REQUEST_CREATED` and `COLLECTION_COMPLETED`.
  - Interactive OpenAPI docs generated at `/docs`.

---

## Budget & Cost Verification
- Total infrastructure cost: **₹0 / $0**.
- Total software subscription cost: **₹0 / $0**.
- Zero credit cards or paid cloud accounts required to develop, run, test, or demonstrate the entire product.


---

### [Log-003] Enterprise Additions, UI Enhancement Bridges & Zero-Cost Cloud Deployment
- **Objective:** Finalize product completeness by integrating interactive UI bridges for real-world scrap workflows (scale weighing, live mandi rates, UPI payment links, digital EPR certificates), containerization, automated CI/CD, and zero-cost cloud deployment specifications.
- **Components Implemented:**
  1. **Frontend UI Enhancement Bridges (`frontend/phir-enhancements.js`):**
     - **Live Mandi Scrap Rate Card Modal (`openMandiRates()`):** Dynamically displays indicative per-kg scrap prices across all 6 materials (PET ₹15, Cardboard ₹12.50, Paper ₹9, Aluminium ₹110, Glass ₹4.50, Wood ₹3) with quick-estimate calculations and truck-art styling.
     - **Physical Scale Weighing Reconciliation Modal:** Intercepts collector collection actions to capture physical scale readings and contamination deduction ($0\text{--}100\%$), auto-calculating net weight and net payout.
     - **Instant UPI Payment Link & QR Generator:** Generates compliant `upi://pay?pa=...` links for immediate cashless settlement from collector to household.
     - **Digital EPR Certificate Modal (`openEprCertificate()`):** Provides recyclers and households with a downloadable, printable Extended Producer Responsibility certificate complete with SHA-256 cryptographic proof hashes.
  2. **Automated Frontend Build Pipeline:**
     - Updated `scripts/build_fast_frontend.py` to include `phir-enhancements.js` in `BRIDGES` and cache-bust references to `20261013-2`.
     - Rebuilt and verified `frontend/amplify-site/index.html` and assets.
  3. **Containerization & Cloud Blueprints:**
     - `Dockerfile`: Multi-stage slim container image with non-root security and healthcheck.
     - `docker-compose.yml`: Persistent SQLite volume orchestration (`./data:/app/data`).
     - `render.yaml`: Infrastructure-as-code blueprint for Render.com free web service.
     - `fly.toml`: Fly.io zero-cost deployment manifest.
  4. **Automated GitHub Actions CI/CD (`.github/workflows/ci.yml`):**
     - Matrix testing across Python 3.11, 3.12, and 3.13.
     - Runs the full 38-test suite.
     - Validates frontend build reproducibility (`git diff --exit-code -- frontend/amplify-site`).
     - Validates deterministic seed data generation.
  5. **OpenAPI 3.1 Specification (`docs/openapi.json`):**
     - Exported machine-readable OpenAPI specification covering all 38 API endpoints for Postman/Swagger import.
- **Verification:**
  - `python -m unittest discover -s tests -v`: **38/38 tests passing (1.727s)**.
  - `python scripts/seed_demo_data.py`: Verified deterministic JSON output.
  - `git diff --exit-code -- frontend/amplify-site`: Verified clean frontend build output.
