from pydantic import BaseModel
from uuid import UUID

class Item(BaseModel):
    name = str
    quantity = int
    checked = bool
    list_id = int

class ListBase(BaseModel):
    id = UUID
    name = str
    store = str
    items = [Item]
    user_id: UUID

    class Config:
        from_attributes = True