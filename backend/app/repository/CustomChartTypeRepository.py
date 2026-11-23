from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import CustomChartType
from app.repository.base import BaseCrudRepository


class CustomChartTypeRepository(BaseCrudRepository[CustomChartType]):
    def __init__(self, db: Session):
        super().__init__(CustomChartType, db)

    def get_all_by_user_id(self, user_id: int) -> List[CustomChartType]:
        statement = select(self.model).where(CustomChartType.user_id == user_id)
        return list(self.db.scalars(statement).all())
