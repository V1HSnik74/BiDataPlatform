from typing import TypeVar, Generic, Type, Optional, List

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.base import Base

ModelType = TypeVar('ModelType', bound=Base)

class BaseCrudRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get(self, id: int) -> Optional[ModelType]:
        return self.db.get(self.model, id)

    def get_various(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        statement = select(self.model).offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def create(self, **kwargs) -> ModelType:
        db_obj = self.model(**kwargs)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj, **kwargs) -> ModelType:
        for field, value in kwargs.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> Optional[ModelType]:
        obj = self.get(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj