from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database (file will be created in project root)
SQLALCHEMY_DATABASE_URL = "sqlite:///./emi_calls.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency for FastAPI (this was missing)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()