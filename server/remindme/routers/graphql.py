import strawberry
from ..resolvers.queries import Query
from ..resolvers.mutations import UserMutation, ListMutation

@strawberry.type
class Mutation(UserMutation,ListMutation):
    pass

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation
)