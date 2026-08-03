import os
from celery import Celery
from dotenv import load_dotenv
from twilio.rest import Client
from app.database import SessionLocal
from app import crud
from datetime import datetime
from urllib.parse import quote

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

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
)






def format_date_for_speech(date_value):
    """Convert date to natural format like '10th June 2026'"""
    try:
        if isinstance(date_value, str):
            for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%d-%m-%Y"):
                try:
                    dt = datetime.strptime(date_value, fmt)
                    break
                except ValueError:
                    continue
            else:
                return str(date_value)
        else:
            dt = date_value

        day = dt.day
        suffix = "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
        return f"{day}{suffix} {dt.strftime('%B %Y')}"
    except:
        return str(date_value)


def format_amount_for_speech(amount):
    """Convert number to words (Indian style)"""
    try:
        num = int(float(amount))
        if num == 0:
            return "zero"

        ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
                "sixteen", "seventeen", "eighteen", "nineteen"]
        tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

        def convert(n):
            if n < 20:
                return ones[n]
            elif n < 100:
                return tens[n // 10] + ("" if n % 10 == 0 else " " + ones[n % 10])
            elif n < 1000:
                return ones[n // 100] + "  hundred " + ("" if n % 100 == 0 else " " + convert(n % 100))
            elif n < 100000:
                return convert(n // 1000) + "  thousand  " + ("" if n % 1000 == 0 else " " + convert(n % 1000))
            else:
                return str(n)  # fallback for very large numbers

        return convert(num)
    except:
        return str(amount)


@celery.task
def make_outbound_call(customer_id: int, phone: str, name: str, emi_amount: str, due_date: str):
    client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

    # Format for natural speaking
    formatted_date = format_date_for_speech(due_date)
    formatted_amount = format_amount_for_speech(emi_amount)

    # URL encode
    encoded_name = quote(str(name))
    encoded_amount = quote(formatted_amount)
    encoded_date = quote(formatted_date)

    call = client.calls.create(
        to=phone,
        from_=os.getenv("TWILIO_PHONE_NUMBER"),
        url=f"{os.getenv('PUBLIC_URL')}/voice?name={encoded_name}&amount={encoded_amount}&date={encoded_date}",
        status_callback=f"{os.getenv('PUBLIC_URL')}/call-status",
        status_callback_event=["completed"]
    )

    db = SessionLocal()
    crud.create_call_log(db, customer_id, call.sid, "initiated")
    db.close()

    return call.sid
    
    