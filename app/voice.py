from twilio.twiml.voice_response import VoiceResponse
from fastapi import Request

def get_voice_response():
    response = VoiceResponse()
    response.say("Hello, this is a reminder for your E M I payment of ₹XXXX due on date XXXX. "
                 "Press 1 if you will pay on time, Press 2 if you need more time.", 
                 voice="Polly.Joanna")
    response.gather(num_digits=1, action="/process-response", method="POST")
    return str(response)

async def process_user_response(request: Request):
    form = await request.form()
    digits = form.get("Digits")
    call_sid = form.get("CallSid")
    
    # TODO: Save response in DB using crud.py
    if digits == "1":
        return "Thank you. We have noted that you will pay on time."
    else:
        return "Thank you. We will follow up with you."