import os.path
from pathlib import Path
from typing import Optional, Dict, Any, List

import numpy as np
import pandas as pd
from fastapi import HTTPException

from app.models.models import Upload, Graph, User
from app.repository.CustomChartTypeRepository import CustomChartTypeRepository
from app.repository.graphRepository import GraphRepository
from app.repository.uploadRepository import UploadRepository
from app.repository.userRepository import UserRepository
from app.schemas.graph import GraphBase, GraphUpdate
from app.services.file_parser import file_parser, FileParserError


class GraphService:
    def __init__(self, graph_repo: GraphRepository, upload_repo: UploadRepository, user_repo: UserRepository,
                 chart_type_repo: CustomChartTypeRepository):
        self.graph_repo = graph_repo
        self.upload_repo = upload_repo
        self.user_repo = user_repo
        self.chart_type_repo = chart_type_repo

    def _get_user(self, user_id: int) -> User:
        user = self.user_repo.get(user_id)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Пользователь не найден"
            )
        return user

    def _has_upload_access(self, user: User, upload: Upload) -> bool:
        if user.role == "admin" or user.scope == "all":
            return True
        if user.scope == "department" and user.department == upload.department and user.department:
            return True
        if upload.user_id == user.id:
            return True
        return False

    def _get_upload(self, upload_id: int, user: User) -> Upload:
        upload = self.upload_repo.get(upload_id)
        if not upload:
            raise HTTPException(status_code=404, detail="Файл не найден")
        if not self._has_upload_access(user, upload):
            raise HTTPException(status_code=403, detail="Нет доступа к этому файлу")
        if not os.path.exists(upload.filepath):
            raise HTTPException(status_code=404, detail="Файл не доступен")
        return upload

    def preview_graph(self, graph: GraphBase, curr_user_id: int):
        user = self._get_user(curr_user_id)
        upload = self._get_upload(graph.upload_id, user)
        path = Path(upload.filepath)
        try:
            df = file_parser.load_df(path)
        except FileParserError as e:
            raise HTTPException(status_code=422, detail=str(e))
        return self._aggregate_data(df, graph.chart_type, graph.x_axis, graph.y_axis, graph.aggregation_func,
                                    graph.limit)

    def create_graph(self, graph: GraphBase, user_id: int) -> Graph:
        user = self._get_user(user_id)
        self._get_upload(graph.upload_id, user)
        chart_type_id = graph.chart_type
        if chart_type_id not in ["bar", "scatter", "pie"]:
            chart_type_obj =  self.chart_type_repo.get(int(chart_type_id))
            if not chart_type_obj or chart_type_obj.user_id != user_id:
                raise HTTPException(status_code=404, detail="Тип графика не найден")
        return self.graph_repo.create(
            title = graph.title,
            chart_type = graph.chart_type,
            upload_id = graph.upload_id,
            user_id = user_id,
            x_axis = graph.x_axis,
            y_axis = graph.y_axis,
            aggregation_func = graph.aggregation_func or None,
            limit = graph.limit or 10,
            constraints = graph.constraints
        )

    def update_graph(self, graph_upd: GraphUpdate, user_id: int, graph_id: int) -> Graph:
        user = self._get_user(user_id)
        graph = self.graph_repo.get(graph_id)
        if not graph:
            raise HTTPException(status_code=404, detail="График не найден")
        if graph.user_id != user_id and user.role != "admin":
            raise HTTPException(status_code=403, detail="Нет прав на редактирование этого графика")
        update_data = graph_upd.model_dump(exclude_unset=True)
        chart_type_id = update_data.get("chart_type")
        if chart_type_id and chart_type_id not in ["bar", "scatter", "pie"]:
            chart_type_obj = self.chart_type_repo.get(int(chart_type_id))
            if not chart_type_obj or chart_type_obj.user_id != user_id:
                raise HTTPException(status_code=404, detail="Тип графика не найден")
        return self.graph_repo.update(db_obj=graph, **update_data)

    def _aggregate_data(
            self,
            df: pd.DataFrame,
            chart_type: str,
            x_axis: str,
            y_axis: List[str],
            agg_func: Optional[str],
            limit: Optional[int]) -> Dict[str, Any]:
        if chart_type == "scatter":
            x_num = pd.to_numeric(df[x_axis], errors="coerce")
            datasets = []
            for y_col in y_axis:
                y_num = pd.to_numeric(df[y_col], errors="coerce")
                valid_mask = pd.notna(x_num) & pd.notna(y_num)
                points = [{"x": float(x), "y": float(y)} for x, y in zip(x_num[valid_mask], y_num[valid_mask])]
                datasets.append({"label": y_col, "data": points})
            return {"labels": [], "datasets": datasets}
        for y_col in y_axis:
            df[y_col] = pd.to_numeric(df[y_col], errors="coerce")
        agg_dict = {"SUM": "sum", "AVG": "mean", "COUNT": "count"}
        selected_agg = agg_dict.get((agg_func or "SUM").upper(), "sum")
        agg_spec = {col: selected_agg for col in y_axis}
        grouped = df.groupby(x_axis, as_index=False).agg(agg_spec)
        primary_metric = y_axis[0]
        grouped = grouped.sort_values(by=primary_metric, ascending=False)
        if limit is not None and len(grouped) > limit:
            top_df = grouped.iloc[:limit].copy()
            others_df = grouped.iloc[limit:]
            other_row: Dict[str, Any] = {x_axis: "Прочее"}
            for y_col in y_axis:
                if selected_agg == "mean":
                    other_row[y_col] = others_df[y_col].mean()
                else:
                    other_row[y_col] = others_df[y_col].sum()
            result_df = pd.concat([top_df, pd.DataFrame([other_row])], ignore_index=True)
        else:
            result_df = grouped
        result_df = result_df.replace({np.nan: 0})
        labels = result_df[x_axis].astype(str).tolist()
        datasets = []
        for y_col in y_axis:
            datasets.append({
                "label": y_col,
                "data": result_df[y_col].round(2).fillna(0).tolist()
            })
        return {"labels": labels, "datasets": datasets}

    def get_user_graphs(self, user_id: int) -> List[Graph]:
        user = self._get_user(user_id)
        return self.graph_repo.get_available_graphs(user)

    def delete_graph(self, graph_id: int, user_id: int):
        user = self._get_user(user_id)
        graph = self.graph_repo.get(graph_id)
        if not graph:
            raise HTTPException(status_code=404, detail="График не найден")
        if graph.user_id != user_id and user.role != "admin":
            raise HTTPException(status_code=403, detail="Нет доступа к удалению этого объекта")
        self.graph_repo.delete(graph_id)