from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.models import User
from app.repository.base import BaseCrudRepository


class UserRepository(BaseCrudRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_login_email_or_phone(self, identifier: str) -> Optional[User]:
        user = select(User).where(or_(User.login == identifier, User.phone_num == identifier, User.email == identifier))
        return self.db.scalar(user)

    def get_by_login(self, login: str) -> Optional[User]:
        user = select(User).where(User.login == login)
        return self.db.scalar(user)

    def get_by_email(self, email: str) -> Optional[User]:
        user = select(User).where(User.email == email)
        return self.db.scalar(user)

    def get_by_phone_num(self, phone_num: str) -> Optional[User]:
        user = select(User).where(User.phone_num == phone_num)
        return self.db.scalar(user)
