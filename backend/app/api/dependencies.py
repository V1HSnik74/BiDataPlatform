from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import User
from app.repository.graphRepository import GraphRepository
from app.repository.uploadRepository import UploadRepository
from app.services.graph_service import GraphService
from app.services.upload_service import UploadService


def get_upload_service(db: Session = Depends(get_db)) -> UploadService:
    return UploadService(
        upload_repo=UploadRepository(db)
    )

def get_graph_service(db: Session = Depends(get_db)) -> GraphService:
    return GraphService(
        graph_repo=GraphRepository(db),
        upload_repo=UploadRepository(db),
    )

def get_current_user(db: Session = Depends(get_db)) -> User | None:
    user = db.query(User).first()
    if not user:
        return None
    return user