from typing import Optional
from pydantic import BaseModel, EmailStr, model_validator, ConfigDict


class UserRegister(BaseModel):
    login: str
    password: str
    password_confirm: str
    email: EmailStr
    phone_num: Optional[str] = None

    @model_validator(mode="after")
    def passwords_match(self) -> "UserRegister":
        if self.password != self.password_confirm:
            raise ValueError("Пароли не совпадают")
        return self


class UserLogin(BaseModel):
    identifier: str
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    login: str
    email: EmailStr
    phone_num: Optional[str] = None
    role: str = 'user'
    model_config = ConfigDict(from_attributes=True)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    new_password_confirm: str

    @model_validator(mode="after")
    def passwords_match(self) -> "ResetPasswordRequest":
        if self.new_password != self.new_password_confirm:
            raise ValueError("Пароли не совпадают")
        return self
