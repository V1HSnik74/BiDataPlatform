from typing import Optional

from pydantic import BaseModel, ConfigDict


class CustomChartTypeRequest(BaseModel):
    name: str
    icon: str
    blueprint: dict

class CustomChartTypeResponse(BaseModel):
    id: int
    name: str
    icon: str
    blueprint: dict
    model_config = ConfigDict(from_attributes=True)

class CustomChartTypeUpdateRequest(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    blueprint: Optional[dict] = None

class CustomChartTypeDeleteResponse(BaseModel):
    id: int
    message: str