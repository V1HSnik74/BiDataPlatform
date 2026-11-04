from pathlib import Path
from typing import List

from fastapi import HTTPException, UploadFile
from starlette import status

from app.models.models import Upload
from app.repository.uploadRepository import UploadRepository
from app.services.file_parser import file_parser, FileParserError
from app.services.file_storage import file_storage


class UploadService:
    def __init__(self, upload_repo: UploadRepository):
        self.upload_repo = upload_repo

    def upload_file(self, file: UploadFile, user_id: int) -> Upload:
        original_filename = file.filename or "unknown_filename"
        ext = Path(original_filename).suffix.lower()
        if ext not in file_parser.SUPPORTED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неподдерживаемый формат файла"
            )
        try:
            df = file_parser.parse_to_df(file.file, ext)
        except FileParserError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        try:
            _, parquet_filepath = file_storage.save_parquet(df, original_filename, user_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка сохранения файла на диск {str(e)}"
            )

        try:
            dimensions, measures = file_parser.get_dimensions_and_measures(Path(parquet_filepath))
        except FileParserError as e:
            file_storage.delete_file(parquet_filepath)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

        return self.upload_repo.create(
            filename=original_filename,
            filepath=parquet_filepath,
            dimensions=dimensions,
            measures=measures,
            user_id=user_id)

    def get_user_uploads(self, user_id: int) -> List[Upload]:
        return self.upload_repo.get_by_user_id(user_id)

    def delete_upload(self, upload_id: int, user_id: int):
        upload = self.upload_repo.get(upload_id)
        if not upload or upload.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Файл не найден"
            )
        file_storage.delete_file(upload.filepath)
        self.upload_repo.delete(upload_id)
