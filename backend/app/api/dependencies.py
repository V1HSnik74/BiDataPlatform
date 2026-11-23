from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from starlette import status

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.models import User
from app.repository.CustomChartTypeRepository import CustomChartTypeRepository
from app.repository.graphRepository import GraphRepository
from app.repository.uploadRepository import UploadRepository
from app.repository.userRepository import UserRepository
from app.services.admin_panel_service import AdminPanelService
from app.services.auth import AuthService
from app.services.custom_chart_type_service import CustomChartTypeService
from app.services.graph_service import GraphService
from app.services.upload_service import UploadService

bearer_scheme = HTTPBearer()


def get_user_repo(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


def get_upload_service(db: Session = Depends(get_db),
                       user_repo: UserRepository = Depends(get_user_repo)) -> UploadService:
    return UploadService(
        upload_repo=UploadRepository(db),
        user_repo=user_repo
    )


def get_graph_service(db: Session = Depends(get_db),
                      user_repo: UserRepository = Depends(get_user_repo)) -> GraphService:
    return GraphService(
        graph_repo=GraphRepository(db),
        upload_repo=UploadRepository(db),
        user_repo=user_repo,
        chart_type_repo=CustomChartTypeRepository(db),
    )


def get_custom_chart_types_service(db: Session = Depends(get_db),
                                   user_repo: UserRepository = Depends(get_user_repo)) -> CustomChartTypeService:
    return CustomChartTypeService(
        custom_chart_repo=CustomChartTypeRepository(db),
        user_repo=user_repo
    )


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(user_repo=UserRepository(db))


def get_admin_panel_service(user_repo: UserRepository = Depends(get_user_repo)) -> AdminPanelService:
    return AdminPanelService(user_repo=user_repo)


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


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права администратора"
        )
    return current_user
