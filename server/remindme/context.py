import strawberry
from sqlalchemy.orm import Session
from typing import Optional
from redis import Redis
from fastapi import Request,Depends
from .database import get_db
from .models.users import User
from .auth import verify_jwt_token
from .redis import get_redis

class MyContext(strawberry.fastapi.BaseContext):
    def __init__(self, db: Session, redis_client: Redis, user: Optional[User] = None):
        self.db = db
        self.redis_client = redis_client
        self.user = user

    def invalidate_user_cache(self, user_email: str):
        """Invalidate cache related to the user."""
        self.redis_client.delete(f"user:{user_email}")

    def get_current_user(self, request: Request) -> Optional[User]:
        """Authenticate and retrieve the user from Redis or the database."""
        token = request.headers.get("Authorization")
        if not token:
            return None  # Return None if no token is provided

        user = verify_jwt_token(token, self.db, self.redis_client)
        return user

async def get_context(request: Request, db: Session = Depends(get_db), redis_client = Depends(get_redis)) -> MyContext:
    # Retrieve the current user using the context method
    if "/graphql" in str(request.url) and not request.headers.get("Authorization"):
        return MyContext(db=db, redis_client=redis_client,user=None)
    current_user = MyContext(db, redis_client).get_current_user(request)
    return MyContext(db=db, redis_client=redis_client, user=current_user)