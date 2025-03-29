from .config import settings
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from typing import Type, TypeVar, Optional, List
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import UUID

db_url = settings.DATABASE_URL
if db_url is None:
    raise RuntimeError("DATABASE_URL environment variable not set")

metadata = MetaData()
engine = create_engine(db_url, pool_pre_ping=True, poolclass=NullPool)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base(metadata=metadata)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


T = TypeVar("T")

class BaseManager:
    def __init__(self, model: Type[T], db:Session):
        self.db = db
        self.model = model

    def get_by_id(self, obj_id: UUID) -> Optional[T]:
        """Fetch an object by its ID."""
        return self.db.query(self.model).filter(self.model.id == obj_id).first()

    def get_all(self) -> List[T]:
        """Fetch all objects from the database."""
        return self.db.query(self.model).all()

    def create(self, obj_in: BaseModel) -> T:
        """Create a new object."""
        obj_data = self.model(**obj_in.model_dump())
        self.db.add(obj_data)
        self.db.commit()
        self.db.refresh(obj_data)
        return obj_data

    def update(self, obj_id: UUID, obj_in: BaseModel) -> Optional[T]:
        """Update an existing object."""
        db_obj = self.db.query(self.model).filter(self.model.id == obj_id).first()
        if not db_obj:
            return None
        for key, value in obj_in.model_dump(exclude_unset=True,exclude_none=True).items():
            setattr(db_obj, key, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, obj_id: UUID) -> bool:
        """Delete an object by ID."""
        obj = self.db.query(self.model).filter(self.model.id == obj_id).first()
        if not obj:
            return False
        self.db.delete(obj)
        self.db.commit()
        return True
