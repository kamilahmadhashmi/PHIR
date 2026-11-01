# Phir — Environmental Recovery Platform

[![CI](https://github.com/kamilahmadhashmi/PHIR/actions/workflows/ci.yml/badge.svg)](https://github.com/kamilahmadhashmi/PHIR/actions)
[![OpenAPI 3.1.0](https://img.shields.io/badge/OpenAPI-3.1.0-blue.svg)](docs/openapi.json)
[![Zero Cost](https://img.shields.io/badge/Budget-%E2%82%B90%20%2F%20%240%20Free-brightgreen.svg)](#run-the-unified-zero-cost-application-fastapi--sqlite--full-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Phir is an environmental resource recovery platform and proof of concept for helping recyclable household material
reach the existing kabadiwala and recycling network.

```text
Household → recovery request → kabadiwala → collected inventory → recycler
```

The project demonstrates a complete coordination flow across households, informal waste collectors (kabadiwalas), and recyclers with dynamic scrap mandi pricing, physical scale weighing reconciliation, instant UPI payout links, and digital Extended Producer Responsibility (EPR) chain-of-custody tracking.

## Current status

The repository provides a unified zero-cost architecture:
- **Relational Backend Engine**: Async FastAPI backend backed by SQLite with Write-Ahead Logging (WAL), foreign key enforcement, and ACID transaction isolation.
- **Interactive Folk-Art Experience**: Complete high-performance Truck-Art UI served directly from `frontend/amplify-site/` at `/`.
- **EPR Audit Ledger & Pricing**: Dynamic Mandi scrap rates, physical weight reconciliation with contamination deductions, and immutable SHA-256 cryptographic audit logs.
- **Enterprise Containerization**: Multi-stage slim Docker image and Docker Compose specification.
- **CI/CD Quality Gate**: Automated GitHub Actions testing across Python 3.11, 3.12, and 3.13.

## Run the unified zero-cost application (FastAPI + SQLite + Full UI)

Requirements: Python 3.10 or newer. Zero paid subscriptions or cloud resources required.

```bash
# 1. Install optional production dependencies (FastAPI + Uvicorn)
pip install -r requirements.txt

# 2. Run the unified application
python run.py
```

Open <http://localhost:8080>. This launches the complete product:
- **Full Interactive Web App**: Serves the complete truck-art interface directly from `frontend/amplify-site/` at `/`.
- **Relational Backend Engine**: Runs high-performance async FastAPI backed by SQLite with Write-Ahead Logging (WAL) and ACID transactions.
- **Interactive API Documentation**: Explore and execute all REST endpoints live at <http://localhost:8080/docs> (Swagger UI) or <http://localhost:8080/redoc>.
- **EPR Audit Ledger & Pricing**: Includes dynamic Mandi scrap rate cards, physical weight reconciliation, and immutable chain-of-custody logging.

On Linux/macOS, `./scripts/run_demo.sh` automatically detects FastAPI and launches `run.py`, falling back to the lightweight standard-library server if optional dependencies are not installed.

## Run with Docker (Zero Configuration)

Phir includes a multi-stage slim container image (<150MB) and Docker Compose setup:

```bash
# Build and run with Docker Compose
docker compose up --build
```

Visit <http://localhost:8080>. Application data is automatically persisted in `./data/phir.db`.

### Zero-Cost Cloud Deployment

Phir includes production-ready blueprints for 100% free hosting tiers:
- **Render.com**: Connect the repository and deploy with [`render.yaml`](render.yaml) as a free web service.
- **Fly.io**: Launch globally using [`fly.toml`](fly.toml) (`fly launch`).
- **Self-hosted / VPS**: Run `docker compose up -d`.

## Interactive API & OpenAPI 3.1 Specification

- **Live Interactive Swagger UI**: <http://localhost:8080/docs>
- **Live Interactive ReDoc**: <http://localhost:8080/redoc>
- **Machine-readable OpenAPI Specification**: [`docs/openapi.json`](docs/openapi.json) — Ready for direct import into Postman, Insomnia, or API gateways.

## Project layout

| Path | Purpose |
| --- | --- |
| `run.py` | Unified application runner (FastAPI + SQLite + Frontend) |
| `src/` | FastAPI application, relational repository, rate engine, reconciler, and audit ledger |
| `Dockerfile` | Multi-stage slim production container build |
| `docker-compose.yml` | Local and production container orchestration with persistent volume |
| `render.yaml` | Render.com free cloud web service blueprint |
| `fly.toml` | Fly.io zero-cost deployment configuration |
| `.github/workflows/` | GitHub Actions CI/CD matrix workflow |
| `frontend/` | Stylized HTML experience, API bridges, enhancements, map, and build inputs |
| `scripts/` | Local run, deterministic seed, and frontend packaging utilities |
| `docs/` | Product, API, data, OpenAPI specification, demo, and status documentation |
| `tests/` | Python unit, workflow, and FastAPI integration test suite |
| `PROJECT_ENGINEERING_LOG.md` | Chronological engineering audit and architecture decisions |

`frontend/backend-context/` contains historical reference snapshots. Generated output such as `dist/` is local build material and is ignored by Git.

## Frontend package

The current frontend source is `frontend/phirFinal.optimized.html`.
The complete static package, including its generated HTML, all 44 hashed media assets, runtime scripts, map, and headers, is checked in at `frontend/amplify-site/`. Rebuild that directory with:

```bash
python3 scripts/build_fast_frontend.py --output frontend/amplify-site
```

Then verify that the generated package is unchanged with:

```bash
git diff --exit-code -- frontend/amplify-site
```

See [`frontend/README.md`](frontend/README.md) for local preview instructions.

## Demo data inspection

Print and inspect the deterministic seed fixture:

```bash
python3 scripts/seed_demo_data.py
```

## Development checks & test suite

From the repository root, run the test suite with:

```bash
python3 -m unittest discover -s tests -v
```

All 38 integration and domain unit tests run in <2 seconds with zero external dependencies.
