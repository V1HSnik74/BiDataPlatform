from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from starlette import status

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.models import User
from app.repository.graphRepository import GraphRepository
from app.repository.uploadRepository import UploadRepository
from app.repository.userRepository import UserRepository
from app.services.auth import AuthService
from app.services.graph_service import GraphService
from app.services.upload_service import UploadService

bearer_scheme = HTTPBearer()


def get_upload_service(db: Session = Depends(get_db)) -> UploadService:
    return UploadService(
        upload_repo=UploadRepository(db)
    )


def get_graph_service(db: Session = Depends(get_db)) -> GraphService:
    return GraphService(
        graph_repo=GraphRepository(db),
        upload_repo=UploadRepository(db),
    )


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(user_repo=UserRepository(db))


def get_user_repo(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
        user_repo: UserRepository = Depends(get_user_repo)) -> User:
    token = credentials.credentials
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный или просроченный токен",
            headers={"WWW-Authenticate": "Bearer"}
        )
    user = user_repo.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user
