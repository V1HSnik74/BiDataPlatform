from fastapi import HTTPException, BackgroundTasks
from starlette import status

from app.core.notifications import send_reset_email
from app.core.security import hash_password, verify_password, create_access_token, create_reset_password_token, \
    decode_reset_password_token
from app.repository.userRepository import UserRepository
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register_user(self, data: UserRegister):
        if self.user_repo.get_by_login(data.login):
            raise HTTPException(status_code=400, detail="Пользователь с таким логином уже существует")
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(status_code=400, detail="Пользователь с этой почтой уже существует")
        if data.phone_num:
            if self.user_repo.get_by_phone_num(data.phone_num):
                raise HTTPException(status_code=400, detail="Пользователь с таким номером уже существует")
        return self.user_repo.create(
            login=data.login,
            email=data.email,
            phone_num=data.phone_num,
            password=hash_password(data.password),
            role="user",
            scope="default"
        )

    def login_user(self, data: UserLogin) -> TokenResponse:
        user = self.user_repo.get_by_login_email_or_phone(data.identifier)
        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин/email или пароль")
        token = create_access_token(user_id=user.id, remember_me=data.remember_me)
        return TokenResponse(access_token=token)

    def forgot_password(self, data: ForgotPasswordRequest, background_tasks: BackgroundTasks) -> dict:
        user = self.user_repo.get_by_email(data.email)
        if user:
            token = create_reset_password_token(user.id)
            reset_link = f"http://localhost:5173/reset-password?token={token}"
            background_tasks.add_task(send_reset_email, user.email, reset_link)
        return {"message": "Если такой email зарегистрирован, мы отправили ссылку для сброса пароля"}

    def reset_password(self, data: ResetPasswordRequest) -> dict:
        user_id = decode_reset_password_token(data.token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ссылка для сброса пароля недействительна или устарела"
            )
        user = self.user_repo.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )
        self.user_repo.update(db_obj=user, password=hash_password(data.new_password))
        return {"message": "пароль успешно изменен"}
