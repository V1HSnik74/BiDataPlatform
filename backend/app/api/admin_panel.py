from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from app.api.dependencies import get_current_admin, get_admin_panel_service
from app.models.models import User
from app.schemas.admin_panel import UsersResponse, UserUpdatePermission, UserDeleteResponse
from app.services.admin_panel_service import AdminPanelService

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


@router.get("/", response_model=List[UsersResponse])
def get_all_users(service: AdminPanelService = Depends(get_admin_panel_service)):
    return service.get_all_users()


@router.patch("/{user_id}", response_model=UsersResponse, status_code=status.HTTP_200_OK)
def update_user_permissions(user_id: int, data: UserUpdatePermission,
                            service: AdminPanelService = Depends(get_admin_panel_service),
                            curr_admin: User = Depends(get_current_admin)):
    return service.update_user_permissions(data, user_id, curr_admin.id)


@router.delete("/{user_id}", response_model=UserDeleteResponse, status_code=status.HTTP_200_OK)
def delete_user(user_id: int, service: AdminPanelService = Depends(get_admin_panel_service),
                curr_admin: User = Depends(get_current_admin)):
    service.delete_user(user_id, curr_admin.id)
    return UserDeleteResponse(id=user_id, message="Пользователь успешно удален")
