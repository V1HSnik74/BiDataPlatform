import os
import uuid
from pathlib import Path

from fastapi import HTTPException
from pandas import DataFrame

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_BASE_DIR = BACKEND_DIR / "storage" / "uploads"


class FileStorage:
    def __init__(self, base_dir: Path = UPLOAD_BASE_DIR):
        self.base_dir = base_dir

    def _get_user_dir(self, user_id: int) -> Path:
        user_dir = self.base_dir / str(user_id)
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir

    def save_parquet(self, df: DataFrame, original_filename: str, user_id: int) -> tuple[str, str]:
        user_dir = self._get_user_dir(user_id)
        unique_prefix = uuid.uuid4().hex[:8]
        filename = Path(original_filename).stem
        parquet_filename = f"{unique_prefix}_{filename}.parquet"
        target_path = user_dir / parquet_filename
        df.to_parquet(target_path, engine="pyarrow", index=False)
        return original_filename, str(target_path)

    def delete_file(self, filepath: str) -> bool:
        path = Path(filepath)
        try:
            if path.exists() and path.is_file():
                os.remove(path)
                return True
        except OSError:
            pass
        return False

file_storage = FileStorage()
