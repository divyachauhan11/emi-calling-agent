from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    phone: str
    emi_amount: Optional[str] = None
    due_date: Optional[str] = None
    loan_type: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CallLogResponse(BaseModel):
    id: int
    customer_id: int
    call_sid: Optional[str] = None
    status: Optional[str] = None
    duration: Optional[int] = None
    ai_response_summary: Optional[str] = None
    user_intent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True