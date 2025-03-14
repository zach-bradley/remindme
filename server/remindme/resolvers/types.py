import strawberry
import typing

# Types
@strawberry.type
class TokenResponse:
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

@strawberry.type
class UserType:
    id: strawberry.ID
    email: str
    first_name: typing.Optional[str] = None
    last_name: typing.Optional[str] = None    

@strawberry.type
class ItemType:
    id: strawberry.ID
    name: str
    quantity: int
    checked: bool

@strawberry.type
class ListType:
    id: strawberry.ID
    name: str
    store: str
    items: typing.List[ItemType]
    user_id: strawberry.ID

# Inputs
@strawberry.input
class UserInput:
    id: strawberry.ID
    email: str
    password: str
    first_name: typing.Optional[str] = None
    last_name: typing.Optional[str] = None

@strawberry.input
class UserLoginInput:
    email: str
    password: str

@strawberry.input
class UserUpdateInput:
    id: strawberry.ID
    first_name: typing.Optional[str] = None
    last_name: typing.Optional[str] = None
    email: typing.Optional[str] = None   

@strawberry.input
class ItemInput:
    name: str
    quantity: int
    list_id: strawberry.ID


@strawberry.input
class ListInput:
    name: str
    store: str
    