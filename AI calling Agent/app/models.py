from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String, unique=True, index=True)
    emi_amount = Column(String)
    due_date = Column(String)

class CallLog(Base):
    __tablename__ = "call_logs"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    call_sid = Column(String, unique=True)
    status = Column(String)
    response = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)