from datetime import datetime, timezone, timedelta
from typing import Optional

import bcrypt
import jwt
from jwt import InvalidTokenError

from app.core.config import settings


def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def create_access_token(user_id: int, remember_me: bool = False) -> str:
    expire_days = 30 if remember_me else 1
    expire = datetime.now(timezone.utc) + timedelta(days=expire_days)
    payload = {"sub": str(user_id), "exp": expire, "type": "access_token"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_access_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "access_token":
            return None
        sub = payload.get("sub")
        if sub is None:
            return None
        return int(sub)
    except (InvalidTokenError, ValueError):
        return None


def create_reset_password_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    payload = {"sub": str(user_id), "exp": expire, "type": "reset_password"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_reset_password_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "reset_password":
            return None
        sub = payload.get("sub")
        if sub is None:
            return None
        return int(sub)
    except (InvalidTokenError, ValueError):
        return None
