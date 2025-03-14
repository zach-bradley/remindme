from typing import Optional, List as PyList
from uuid import UUID
from sqlalchemy.orm import Session
from ..models.lists import List as ListModel, Item as ItemModel
from .types import ListType, ListInput, ItemType, ItemInput

class ListResolvers:
    @staticmethod
    def get_list(id: UUID, db: Session) -> Optional[ListType]:
        list_obj = db.query(ListModel).filter(ListModel.id == id).first()
        if not list_obj:
            return None
        return list_obj
    
    @staticmethod
    def get_lists(db: Session, user_id: UUID) -> PyList[ListType]:
        return ListModel.get_by_user(db, user_id)
    
    @staticmethod
    def create_list(list_data: ListInput, db: Session) -> ListType:
        list_dict = list_data.__dict__.copy()
        db_list = ListModel(**list_dict)
        db.add(db_list)
        db.commit()
        db.refresh(db_list)
        
        return ListType(**db_list.client_dict())
    
    @staticmethod
    def update_list(id: UUID, list_data: ListInput, db: Session) -> Optional[ListType]:
        db_list = db.query(ListModel).filter(ListModel.id == id).first()
        if not db_list:
            return None
        
        for key, value in list_data.__dict__.items():
            setattr(db_list, key, value) if value is not None else None
            
        db.commit()
        db.refresh(db_list)
        
        return ListType(**db_list.client_dict())
    
    @staticmethod
    def delete_list(id: UUID, db: Session) -> bool:
        db_list = db.query(ListModel).filter(ListModel.id == id).first()
        if not db_list:
            return False
        
        db.delete(db_list)
        db.commit()
        return True
    
    @staticmethod
    def create_item(item_data: ItemInput, db: Session) -> ItemType:
        item_dict = item_data.__dict__.copy()
        db_item = ItemModel(**item_dict)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        return ItemType(**db_item.client_dict())
    
    @staticmethod
    def update_item(id: UUID, item_data: ItemInput, db: Session) -> Optional[ItemType]:
        db_item = db.query(ItemModel).filter(ItemModel.id == id).first()
        if not db_item:
            return None
        
        for key, value in item_data.__dict__.items():
            if value is not None and key != "list_id":  # Don't change the list_id
                setattr(db_item, key, value)
        
        db.commit()
        db.refresh(db_item)
        
        return ItemType(**db_item.client_dict())
    
    @staticmethod
    def delete_item(id: UUID, db: Session) -> bool:
        db_item = db.query(ItemModel).filter(ItemModel.id == id).first()
        if not db_item:
            return False
        
        db.delete(db_item)
        db.commit()
        return True
    
    @staticmethod
    def toggle_checked(id: UUID, db: Session) -> Optional[ItemType]:
        db_item = db.query(ItemModel).filter(ItemModel.id == id).first()
        if not db_item:
            return None
        db_item.checked = not db_item.checked
        db.commit()
        db.refresh(db_item)
        return ItemType(**db_item.client_dict())