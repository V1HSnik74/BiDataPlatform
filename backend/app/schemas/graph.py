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