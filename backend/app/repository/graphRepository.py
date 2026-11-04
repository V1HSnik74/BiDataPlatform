from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Graph
from app.repository.base import BaseCrudRepository


class GraphRepository(BaseCrudRepository[Graph]):
    def __init__(self, db: Session):
        super().__init__(Graph, db)

    def get_graphs_by_user_id(self, user_id: int) -> List[Graph]:
        statement = select(self.model).where(Graph.user_id == user_id)
        return list(self.db.scalars(statement).all())
