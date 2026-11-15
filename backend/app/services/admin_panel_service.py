from typing import List

from fastapi import HTTPException

from app.models.models import User
from app.repository.userRepository import UserRepository
from app.schemas.admin_panel import UserUpdatePermission
from app.services.file_storage import file_storage


class AdminPanelService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def update_user_permissions(self, data: UserUpdatePermission, user_id: int, curr_admin_id: int) -> User:
        user = self.user_repo.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        update_data = data.model_dump(exclude_unset=True)
        if user_id == curr_admin_id and update_data.get("role") is not None and update_data.get("role") != "admin":
            raise HTTPException(
                status_code=400,
                detail="Нельзя снять роль администратора с самого себя"
            )
        new_scope = update_data.get("scope", user.scope)
        new_department = update_data.get("department", user.department)
        if new_scope == "department" and not new_department:
            raise HTTPException(
                status_code=400,
                detail="Для области доступа 'department' необходимо указать отдел"
            )
        return self.user_repo.update(user, **update_data)

    def get_all_users(self) -> List[User]:
        users = self.user_repo.get_all()
        return users

    def delete_user(self, user_id: int, curr_admin_id: int):
        if user_id == curr_admin_id:
            raise HTTPException(
                status_code=400,
                detail="Нельзя удалить самого себя"
            )
        user = self.user_repo.get(user_id)
        if not user:
            raise HTTPException(
                status_code=404, detail="Пользователь не найден"
            )
        for upload in user.uploads:
            file_storage.delete_file(upload.filepath)
        return self.user_repo.delete(user_id)
