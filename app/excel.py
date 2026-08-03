import pandas as pd
from app.database import SessionLocal
from app.models import Customer

def import_customers_from_excel(file_path: str):
    df = pd.read_excel(file_path)
    db = SessionLocal()
    for _, row in df.iterrows():
        existing = db.query(Customer).filter(Customer.phone == str(row['phone'])).first()
        if not existing:
            customer = Customer(
                name=row['name'],
                phone=str(row['phone']),
                emi_amount=str(row['emi_amount']),
                due_date=str(row['due_date'])
            )
            db.add(customer)
    db.commit()
    db.close()
    print("Customers imported successfully!")