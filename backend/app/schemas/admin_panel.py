from typing import Optional, Literal

from pydantic import BaseModel, ConfigDict

Role = Literal["admin", "user"]
Scope = Literal["default", "all", "department"]

class UsersResponse(BaseModel):
    id: int
    login: str
    email: str
    role: Role
    scope: Scope
    department: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class UserUpdatePermission(BaseModel):
    role: Optional[Role] = None
    scope: Optional[Scope] = None
    department: Optional[str] = None

class UserDeleteResponse(BaseModel):
    id: int
    message: str

