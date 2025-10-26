# AthletIA - Statistics Microservice (Flask + PostgreSQL)

This microservice manages health & progress statistics. It's a small Flask app using SQLAlchemy and PostgreSQL.

Main features:
- Models: `Statistics` and `ProgressMetric` with enums for period and metric types.
- Full CRUD endpoints for both entities.
- Placeholder integration with an external user microservice to validate `user_id`.

Configuration
- Copy `.env.example` to `.env` and adjust values or set environment variables directly.
- The DB URL is constructed from DB_USER, DB_PASS, DB_HOST, DB_PORT and DB_NAME in `config.py`.

Install

1. Create a virtual environment and activate it.
2. Install dependencies:

```powershell
pip install -r requirements.txt
```

Run (development)

```powershell
# optional: set env vars or use .env
python run.py
```

API Endpoints (examples)

- GET /statistics
- POST /statistics
- GET /statistics/<id>
- PUT /statistics/<id>
- DELETE /statistics/<id>
- GET /statistics/<statistics_id>/progress_metrics
- POST /statistics/<statistics_id>/progress_metrics
- GET /progress_metrics
- GET /progress_metrics/<id>
- PUT /progress_metrics/<id>
- DELETE /progress_metrics/<id>

Notes & next steps
- Add tests and Flask-Migrate for proper migrations in production.
- Improve user-service integration with retries, auth and caching.
