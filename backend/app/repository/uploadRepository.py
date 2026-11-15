from typing import List, Optional

from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import user

from app.models.models import Upload, User
from app.repository.base import BaseCrudRepository


class UploadRepository(BaseCrudRepository[Upload]):
    def __init__(self, db: Session):
        super().__init__(model=Upload, db=db)

    def get_by_user_id(self, user_id: int) -> List[Upload]:
        statement = select(self.model).where(self.model.user_id == user_id)
        return list(self.db.scalars(statement).all())

    def get_by_filepath(self, filepath: str) -> Optional[Upload]:
        statement = select(self.model).where(self.model.filepath == filepath)
        return self.db.scalars(statement).first()

    def get_available_uploads(self, user: User) -> List[Upload]:
        uploads = select(Upload)
        if user.role == "admin" or user.scope == "all":
            pass
        elif user.scope == "department":
            uploads = uploads.where(or_(Upload.department == user.department, Upload.user_id == user.id))
        else:
            uploads = uploads.where(Upload.user_id == user.id)
        return list(self.db.scalars(uploads).all())

