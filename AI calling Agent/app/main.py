from fastapi import FastAPI, UploadFile, File, Depends, Request,Response, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app import crud, models
import pandas as pd
from io import BytesIO
from twilio.twiml.voice_response import VoiceResponse
from dotenv import load_dotenv          # ← Add this
load_dotenv()

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EMI Calling Agent - Backend")

# ====================== CORS (For React Frontend) ======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ====================== HEALTH CHECK ======================
@app.get("/")
def root():
    return {"message": "EMI Calling Agent API is running"}


# ====================== EXCEL UPLOAD ======================

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))
    
    # ====================== CLEAR OLD DATA ======================
    # Delete old call logs first (to avoid foreign key error)
    db.query(models.CallLog).delete()
    db.commit()
    
    # Delete old customers
    db.query(models.Customer).delete()
    db.commit()
    # ============================================================
    
    count = 0
    for _, row in df.iterrows():
        crud.create_customer(
            db=db,
            name=str(row.get('name', '')),
            phone=str(row['phone']),
            emi_amount=str(row.get('emi_amount', '')),
            due_date=str(row.get('due_date', ''))
        )
        count += 1
    
    return {"message": f"Successfully replaced customers. Imported {count} customers from Excel"}

# ====================== GET DATA ======================
@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()


@app.get("/call-logs")
def get_call_logs(db: Session = Depends(get_db)):
    return crud.get_all_call_logs(db)


# ====================== START CALLING CAMPAIGN ======================
@app.post("/start-calling")
def start_calling(db: Session = Depends(get_db)):
    from app.tasks import make_outbound_call
    
    customers = db.query(models.Customer).all()
    
    for customer in customers:
        make_outbound_call.delay(
            customer.id,
            customer.phone,
            customer.name,
            customer.emi_amount,
            customer.due_date
        )
    
    return {"message": f"Started calling campaign for {len(customers)} customers"}


# ====================== TWILIO VOICE ENDPOINTS ======================
# @app.post("/voice")
# async def voice(
#     name: str = Query(...),
#     amount: str = Query(...),
#     date: str = Query(...)
# ):
#     response = VoiceResponse()
    
#     message = (
#         f"Hello {name}, this is a Gentle reminder for your E M I payment of rupees {amount} "
#         f"due on {date}. Press 1 if you will pay on time. "
#         f"Press 2 if you need more time."
#     )
    
#     response.say(message, voice="Polly.Joanna")
#     response.gather(num_digits=1, action="/process-response", method="POST")
    
    
    
#     # ✅ Return as XML, NOT plain string
#     return Response(content=str(response), media_type="application/xml")
# @app.post("/voice")
# async def voice(
#     name: str = Query(...),
#     amount: str = Query(...),
#     date: str = Query(...)
# ):
#     message = (
#         f'Hello {name}, this is a Gentle reminder for your E M I payment '
#         f'<break time="400ms"/> of rupees {amount} '
#         f'<break time="500ms"/> due on '
#         f'<break time="300ms"/> <prosody rate="slow">{date}</prosody> '
#         f'<break time="400ms"/> Press 1 if you will pay on time. '
#         f'Press 2 if you need more time.'
#     )

#     twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     <Say voice="Polly.Joanna">{message}</Say>
#     <Gather numDigits="1" action="/process-response" method="POST"/>
# </Response>"""

#     return Response(content=twiml, media_type="application/xml")

@app.post("/voice")
async def voice(
    name: str = Query("Customer"),
    amount: str = Query("0"),
    date: str = Query("upcoming date")
):
    response = VoiceResponse()
    
    # Construct a clean, natural message
    message = (
        f"Hello {name}, this is a gentle reminder for your E M I payment "
        f"of rupees {amount}, due on {date}. "
        f"Press 1 if you will pay on time. "
        f"Press 2 if you need more time."
    )
    
    # Use Polly.Joanna voice with the built-in Say element
    response.say(message, voice="Polly.Joanna")
    
    # Gather user input safely
    response.gather(num_digits=1, action="/process-response", method="POST")

    return Response(content=str(response), media_type="application/xml")


@app.post("/process-response")
async def process_response(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    digits = form.get("Digits")
    call_sid = form.get("CallSid")

    crud.update_call_log(db, call_sid, response=digits)

    twiml = VoiceResponse()
    if digits == "1":
        twiml.say("Thank you. We have noted that you will pay on time.", voice="Polly.Joanna")
    else:
        twiml.say("Thank you. We will follow up with you shortly.", voice="Polly.Joanna")

    # ✅ Same fix here
    return Response(content=str(twiml), media_type="application/xml")


@app.post("/call-status")
async def call_status(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    call_sid = form.get("CallSid")
    status = form.get("CallStatus")
    duration = form.get("CallDuration")
    
    crud.update_call_log(db, call_sid, status=status, duration=int(duration) if duration else None)
    
    return {"status": "ok"}


# ====================== RUN ======================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)