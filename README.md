1. docker compose up -d
2. alembic upgrade head (миграции)
3. uvicorn app.main:app --reload --port 8000
4. http://localhost:8000/docs (все методы)