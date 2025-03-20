from sqlalchemy.dialects.postgresql import UUID
from .util import TimeStampModel
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Session
from ..database import Base, BaseManager
from ..utils import model_to_dict
from ..resolvers.types import ListType,ItemType
from ..schemas.list_schemas import ItemCreate,ListCreate

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
    def get_by_list(cls, db: Session, list_id: UUID):
        return db.query(cls).filter(cls.list_id == list_id).all()
    
class ListManager(BaseManager):
    def __init__(self, db:Session):
        super().__init__(List, db)

    def serialize_list(self, list: List) -> ListType:
        """Convert the List model to ListType"""
        return ListType(
            id=list.id,
            name=list.name,
            store=list.store,
            items=list.items,
            user_id=list.user_id
        )
    
    def add_item(self,list_id: UUID, item_data: ItemCreate) -> ListType:
        existing_list = self.get_by_id(list_id)
        for field, value in item_data.model_dump(exclude_unset=True).items():
            setattr(existing_list, field, value)
        existing_list.db.commit()
        existing_list.db.refresh(self)
        return self.serialize_list(existing_list)
