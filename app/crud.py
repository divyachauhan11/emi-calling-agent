from sqlalchemy.orm import Session
from app.models import Customer, CallLog
from datetime import datetime

# ============ CUSTOMER ============
def get_customer(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()

def get_customer_by_phone(db: Session, phone: str):
    return db.query(Customer).filter(Customer.phone == phone).first()

def create_customer(db: Session, name: str, phone: str, emi_amount: str, due_date: str):
    db_customer = Customer(
        name=name,
        phone=phone,
        emi_amount=emi_amount,
        due_date=due_date
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


# ============ CALL LOG ============
def create_call_log(db: Session, customer_id: int, call_sid: str, status: str):
    log = CallLog(customer_id=customer_id, call_sid=call_sid, status=status)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def update_call_log(db: Session, call_sid: str, status: str = None, response: str = None, duration: int = None):
    log = db.query(CallLog).filter(CallLog.call_sid == call_sid).first()
    if log:
        if status:
            log.status = status
        if response:
            log.response = response
        if duration is not None:
            log.duration = duration
        db.commit()
        db.refresh(log)
    return log

def get_all_call_logs(db: Session):
    return db.query(CallLog).order_by(CallLog.timestamp.desc()).all()