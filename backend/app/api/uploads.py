from typing import List

from fastapi import APIRouter, UploadFile, Depends, status, File

from app.api.dependencies import get_current_user, get_upload_service
from app.models.models import User
from app.schemas.upload import UploadResponse, UploadDeleteResponse
from app.services.upload_service import UploadService

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
def upload_file(file: UploadFile = File(...), user: User = Depends(get_current_user), service: UploadService =Depends(get_upload_service)):
    return service.upload_file(file, user.id)


@router.get("", response_model=List[UploadResponse])
def get_uploads(user: User = Depends(get_current_user), service: UploadService = Depends(get_upload_service)):
    return service.get_user_uploads(user.id)

@router.delete("/{upload_id}", response_model=UploadDeleteResponse)
def delete_upload(upload_id: int, user: User = Depends(get_current_user), service: UploadService =Depends(get_upload_service)):
    service.delete_upload(upload_id, user.id)
    return UploadDeleteResponse(message="Файл успешно удален", id=upload_id)
