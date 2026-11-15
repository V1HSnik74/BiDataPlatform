from fastapi import APIRouter, Depends, BackgroundTasks
from starlette import status

from app.api.dependencies import get_auth_service
from app.schemas.auth import TokenResponse, UserLogin, UserResponse, UserRegister, ForgotPasswordRequest, \
    ResetPasswordRequest
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, service: AuthService = Depends(get_auth_service)):
    return service.login_user(data)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, service: AuthService = Depends(get_auth_service)):
    return service.register_user(data)

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks, service: AuthService = Depends(get_auth_service)):
    return service.forgot_password(data, background_tasks)

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(data: ResetPasswordRequest, service: AuthService = Depends(get_auth_service)):
    return service.reset_password(data)