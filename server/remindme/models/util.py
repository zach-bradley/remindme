import uuid
from sqlalchemy import UUID, Column,DateTime
from datetime import datetime,timezone
from ..database import Base

class TimeStampModel(Base):
    __abstract__ = True
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    datetime_created = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    last_edited = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)