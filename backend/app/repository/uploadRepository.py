from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Upload
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