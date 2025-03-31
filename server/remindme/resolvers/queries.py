import strawberry
from typing import Optional, List as PyList
from uuid import UUID
from .user_resolvers import UserResolvers
from .list_resolvers import ListResolvers
from .types import UserType,ListType, ItemType


# User resolvers
def get_me(token: str,info:strawberry.Info) -> Optional[UserType]:
    user = info.context.get_current_user()
    return UserType(**user.client_dict())

def get_user(id: UUID, info: strawberry.Info) -> Optional[UserType]:
    db = info.context.db
    return UserResolvers.get_user(id, db)

def get_users(info: strawberry.Info) -> PyList[UserType]:
    db = info.context.db
    return UserResolvers.get_users(db)

# List resolvers
def get_list(id: UUID, info: strawberry.Info) -> Optional[ListType]:
    db = info.context.db
    return ListResolvers.get_list(id, db)

def get_lists(user_id: UUID,info: strawberry.Info) -> PyList[ListType]:
    db = info.context.db
    return ListResolvers.get_lists(db, user_id)

def get_item(id: UUID, info: strawberry.Info) -> Optional[ItemType]:
    db = info.context.db
    return ListResolvers.get_item(id, db)

@strawberry.type
class Query:
    me: Optional[UserType] = strawberry.field(resolver=get_me)
    user: Optional[UserType] = strawberry.field(resolver=get_user)
    users: PyList[UserType] = strawberry.field(resolver=get_users)
    list: Optional[ListType] = strawberry.field(resolver=get_list)
    lists: PyList[ListType] = strawberry.field(resolver=get_lists)
    item: Optional[ItemType] = strawberry.field(resolver=get_item)