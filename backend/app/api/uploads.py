from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repository.uploadRepository import UploadRepository
from app.schemas.upload import UploadResponse, UploadDeleteResponse
from app.services.file_parser import file_parser, FileParserError
from app.services.file_storage import file_storage

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
def upload_file(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        original_filename, filepath = file_storage.save_file(file, user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка сохранения файла на диск {str(e)}"
        )

    try:
        dimensions, measures = file_parser.parse_columns(filepath)
    except FileParserError as e:
        file_storage.delete_file(filepath)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    repo = UploadRepository(db)
    upload_record = repo.create(
        filename=original_filename,
        filepath=filepath,
        dimensions=dimensions,
        measures=measures,
        user_id=user_id
    )

    return upload_record


@router.get("/", response_model=List[UploadResponse])
def get_uploads(user_id: int, db: Session = Depends(get_db)):
    repo = UploadRepository(db)
    return repo.get_by_user_id(user_id)


@router.delete("/{upload_id}", response_model=UploadDeleteResponse)
def delete_upload(upload_id: int, user_id: int, db: Session = Depends(get_db)):
    repo = UploadRepository(db)
    upload = repo.get(upload_id)
    if not upload or upload.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Файл не найден"
        )
    file_storage.delete_file(upload.filepath)
    repo.delete(upload_id)
    return UploadDeleteResponse(message="Файл успешно удален", id=upload_id)
