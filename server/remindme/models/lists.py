from sqlalchemy.dialects.postgresql import UUID
from .util import TimeStampModel
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Session, class_mapper
from ..database import Base
from ..utils import model_to_dict
from ..resolvers.types import ListType,ItemType

class List(TimeStampModel):
    __tablename__ = 'lists'

    name = Column(String, index=True)
    store = Column(String)
    user_id = Column(UUID, ForeignKey('users.id'), nullable=False)

    items = relationship("Item", back_populates="list", cascade="all, delete-orphan")
    user = relationship("User", back_populates="lists")

    @classmethod
    def get_by_user(cls, session: Session, user_id: str):
        return session.query(cls).filter(cls.user_id == user_id).all()

    def client_dict(self):
        return model_to_dict(self,ListType)

class Item(TimeStampModel):
    __tablename__ = 'items'

    name = Column(String, index=True)
    quantity = Column(Integer, default=1)
    checked = Column(Boolean, default=False)
    list_id = Column(UUID, ForeignKey('lists.id'), nullable=False)
    list = relationship("List", back_populates="items")

    def client_dict(self):
        return model_to_dict(self,ItemType)
    
    @classmethod
    def get_by_list(cls, session: Session, list_id: str):
        return session.query(cls).filter(cls.list_id == list_id).all()