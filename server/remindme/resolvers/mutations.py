
import strawberry
from typing import Optional
from uuid import UUID
from .user_resolvers import UserResolvers
from .list_resolvers import ListResolvers
from .types import UserType, UserInput, TokenResponse,ListType, ListInput, ItemType, ItemInput, UserUpdateInput

@strawberry.type
class UserMutation:
    @strawberry.mutation
    def create_user(self, user_data: UserInput, info: strawberry.Info) -> UserType:
        db = info.context.db
        return UserResolvers.create_user(user_data, db)
    
    @strawberry.mutation
    def update_user(self, user_data: UserUpdateInput,info:strawberry.Info) -> UserType:
        db = info.context.db
        return UserResolvers.update_user(user_data,db)
    
    @strawberry.mutation
    def login(self, email: str, password: str, info: strawberry.Info) -> TokenResponse:
        db = info.context.db
        return UserResolvers.login(email, password, db)
    
    @strawberry.mutation
    def reset_password(self,email: str,new_password:str,info:strawberry.Info) -> bool:
        db = info.context.db
        return UserResolvers.reset_password(email,new_password, db)
    
    @strawberry.mutation
    def logout(self, refresh_token:str,info: strawberry.Info) -> bool:
        from ..auth import revoke_refresh_token
        user = info.context.user

        info.context.invalidate_user_cache(user.email)
        revoke_refresh_token(refresh_token, info.context.redis_client)
        return True

@strawberry.type
class ListMutation:
    @strawberry.mutation
    def create_list(self, list_data: ListInput, info: strawberry.Info) -> ListType:
        db = info.context.db
        return ListResolvers.create_list(list_data, db)
    
    @strawberry.mutation
    def update_list(self, id: UUID, list_data: ListInput, info: strawberry.Info) -> Optional[ListType]:
        db = info.context.db
        return ListResolvers.update_list(id, list_data, db)
    
    @strawberry.mutation
    def delete_list(self, id: UUID, info: strawberry.Info) -> bool:
        db = info.context.db
        return ListResolvers.delete_list(id, db)
    
    @strawberry.mutation
    def create_item(self, item_data: ItemInput, info: strawberry.Info) -> ItemType:
        db = info.context.db
        return ListResolvers.create_item(item_data, db)
    
    @strawberry.mutation
    def update_item(self, id: UUID, item_data: ItemInput, info: strawberry.Info) -> Optional[ItemType]:
        db = info.context.db
        return ListResolvers.update_item(id, item_data, db)
    
    @strawberry.mutation
    def delete_item(self, id: UUID, info: strawberry.Info) -> bool:
        db = info.context.db
        return ListResolvers.delete_item(id, db)
    
    @strawberry.mutation
    def toggle_checked(self, id: UUID, info: strawberry.Info) -> Optional[ItemType]:
        db = info.context.db
        return ListResolvers.toggle_checked(id, db)
