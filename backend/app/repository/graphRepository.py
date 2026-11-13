from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import or_

from app.models.models import Graph, User, Upload
from app.repository.base import BaseCrudRepository


class GraphRepository(BaseCrudRepository[Graph]):
    def __init__(self, db: Session):
        super().__init__(Graph, db)

    def get_graphs_by_user_id(self, user_id: int) -> List[Graph]:
        statement = select(self.model).where(Graph.user_id == user_id)
        return list(self.db.scalars(statement).all())

    def get_available_graphs(self, user: User) -> List[Graph]:
        graphs = select(Graph).join(Upload, Graph.upload_id == Upload.id)
        if user.role == "admin" or user.scope == "all":
            pass
        elif user.scope == "department" and user.department:
            graphs = graphs.where(
                or_(Upload.department == user.department, Upload.user_id == user.id, Graph.user_id == user.id))
        else:
            graphs = graphs.where(Graph.user_id == user.id)
        return list(self.db.scalars(graphs).all())
