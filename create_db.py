from app.database import engine, Base
from app.models import Customer, CallLog

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Database created successfully! (emi_calls.db)")