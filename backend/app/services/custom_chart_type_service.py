from typing import List

from fastapi import HTTPException

from app.models.models import CustomChartType, User
from app.repository.CustomChartTypeRepository import CustomChartTypeRepository
from app.repository.userRepository import UserRepository
from app.schemas.custom_chart_type import CustomChartTypeRequest, CustomChartTypeUpdateRequest


class CustomChartTypeService:
    def __init__(self, custom_chart_repo: CustomChartTypeRepository, user_repo: UserRepository):
        self.custom_chart_repo = custom_chart_repo
        self.user_repo = user_repo

    def _get_user(self, user_id: int) -> User:
        user = self.user_repo.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user

    def create_chart_type(self, user_id: int, chart_type_req: CustomChartTypeRequest) -> CustomChartType:
        user = self._get_user(user_id)
        return self.custom_chart_repo.create(
            name=chart_type_req.name,
            icon=chart_type_req.icon,
            blueprint=chart_type_req.blueprint,
            user_id=user.id
        )

    def update_chart_type(self, chart_type_id: int, user_id: int,
                          chart_type_upd_req: CustomChartTypeUpdateRequest) -> CustomChartType:
        chart_type = self.custom_chart_repo.get(chart_type_id)
        if not chart_type:
            raise HTTPException(status_code=404, detail="Тип графика не найден")
        if chart_type.user_id != user_id:
            raise HTTPException(status_code=403, detail="Нет прав на редактирование этого типа графика")
        update_data = chart_type_upd_req.model_dump(exclude_unset=True)
        return self.custom_chart_repo.update(
            db_obj=chart_type,
            **update_data
        )

    def delete_chart_type(self, chart_type_id: int, user_id: int):
        chart_type = self.custom_chart_repo.get(chart_type_id)
        if not chart_type:
            raise HTTPException(status_code=404, detail="Тип графика не найден")
        if chart_type.user_id != user_id:
            raise HTTPException(status_code=403, detail="Нет прав на удаление этого графика")
        self.custom_chart_repo.delete(chart_type_id)

    def get_all_chart_types_user(self, user_id: int) -> List[CustomChartType]:
        return self.custom_chart_repo.get_all_by_user_id(user_id)


