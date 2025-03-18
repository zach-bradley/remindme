from pydantic import BaseModel
from typing import List
from uuid import UUID

class ItemBase(BaseModel):
    name: str
    quantity: int

class ItemCreate(ItemBase):
    checked: bool
    list_id: UUID

class ClientItem(ItemCreate):
    id: UUID

class ListBase(BaseModel):
    name: str
    store: str

class ListCreate(ListBase):
    items: List[ItemBase]
    user_id: UUID    

class ClientList(ListCreate):
    id: UUID
