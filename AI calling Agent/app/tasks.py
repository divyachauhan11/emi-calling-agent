import os
import ssl
from celery import Celery
from dotenv import load_dotenv
from twilio.rest import Client
from app.database import SessionLocal
from app import crud
from datetime import datetime
from urllib.parse import quote

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Enable SSL settings if connecting to rediss:// (Upstash / Cloud Redis)
ssl_options = {"ssl_cert_reqs": ssl.CERT_NONE} if REDIS_URL.startswith("rediss://") else None

celery = Celery(
    "emi_caller",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Free tier optimizations:
    broker_use_ssl=ssl_options,
    redis_backend_use_ssl=ssl_options,
    worker_concurrency=2,              # Prevents running out of free 512MB RAM
    broker_connection_retry_on_startup=True,
    broker_pool_limit=1,               # Limits concurrent idle connections to Upstash
)

# ... Keep the rest of your functions (format_date_for_speech, format_amount_for_speech, make_outbound_call) unchanged ...