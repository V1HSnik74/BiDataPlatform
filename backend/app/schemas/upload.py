from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class UploadBase(BaseModel):
    filename: str
    dimensions: List[str]
    measures: List[str]


class UploadResponse(UploadBase):
    id: int
    user_id: int
    created_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)


class UploadDeleteResponse(BaseModel):
    message: str
    id: int
