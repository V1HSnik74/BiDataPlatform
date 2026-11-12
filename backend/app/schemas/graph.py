from typing import List, Optional

from pydantic import BaseModel, ConfigDict

class GraphBase(BaseModel):
    title: str
    chart_type: str
    upload_id: int
    x_axis: str
    y_axis: List[str]
    aggregation_func: Optional[str]
    limit: Optional[int]

class GraphResponse(GraphBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class GraphDeleteResponse(BaseModel):
    id: int
    message: str

class GraphUpdate(BaseModel):
    title: Optional[str] = None
    chart_type: Optional[str] = None
    upload_id: Optional[int] = None
    x_axis: Optional[str] = None
    y_axis: Optional[List[str]] = None
    aggregation_func: Optional[str] = None
    limit: Optional[int] = None