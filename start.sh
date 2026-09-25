#!/usr/bin/env bash
set -e

# Start the Celery worker in the background
celery -A tasks.celery worker --loglevel=info --concurrency=2 &

# Start your web API (if using FastAPI, change to: uvicorn app.main:app --host 0.0.0.0 --port $PORT)
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT