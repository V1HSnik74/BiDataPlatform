from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from app.api.dependencies import get_current_user, get_custom_chart_types_service
from app.models.models import User
from app.schemas.custom_chart_type import CustomChartTypeResponse, CustomChartTypeRequest, CustomChartTypeUpdateRequest, \
    CustomChartTypeDeleteResponse
from app.services.custom_chart_type_service import CustomChartTypeService

router = APIRouter(prefix="/custom_charts", tags=["custom_charts"])


@router.post("", response_model=CustomChartTypeResponse, status_code=status.HTTP_201_CREATED)
def create_chart_type(chart_type: CustomChartTypeRequest, user: User = Depends(get_current_user),
                      service: CustomChartTypeService = Depends(get_custom_chart_types_service)):
    return service.create_chart_type(user.id, chart_type)


@router.get("", response_model=List[CustomChartTypeResponse])
def get_all_chart_types_user(service: CustomChartTypeService = Depends(get_custom_chart_types_service),
                             user: User = Depends(get_current_user)):
    return service.get_all_chart_types_user(user.id)


@router.patch("/{chart_type_id}", response_model=CustomChartTypeResponse, status_code=status.HTTP_200_OK)
def update_chart_type(chart_type_id: int, chart_type: CustomChartTypeUpdateRequest,
                      user: User = Depends(get_current_user),
                      service: CustomChartTypeService = Depends(get_custom_chart_types_service)):
    return service.update_chart_type(chart_type_id, user.id, chart_type)


@router.delete("/{chart_type_id}", response_model=CustomChartTypeDeleteResponse)
def delete_chart_type(chart_type_id: int, user: User = Depends(get_current_user),
                      service: CustomChartTypeService = Depends(get_custom_chart_types_service)):
    return service.delete_chart_type(user.id, chart_type_id)
