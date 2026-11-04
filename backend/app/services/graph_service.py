import os.path
from pathlib import Path
from typing import Optional, Dict, Any, List

import numpy as np
import pandas as pd
from fastapi import HTTPException

from app.models.models import Upload, Graph
from app.repository.graphRepository import GraphRepository
from app.repository.uploadRepository import UploadRepository
from app.schemas.graph import GraphBase
from app.services.file_parser import file_parser, FileParserError


class GraphService:
    def __init__(self, graph_repo: GraphRepository, upload_repo: UploadRepository):
        self.graph_repo = graph_repo
        self.upload_repo = upload_repo

    def _get_upload(self, upload_id: int, curr_user_id: int) -> Upload:
        upload = self.upload_repo.get(upload_id)
        if not upload:
            raise HTTPException(status_code=404, detail="Файл не найден")
        if upload.user_id != curr_user_id:
            raise HTTPException(status_code=403, detail="Нет доступа к этому файлу")
        if not os.path.exists(upload.filepath):
            raise HTTPException(status_code=404, detail="Файл не доступен")
        return upload

    def preview_graph(self, graph: GraphBase, curr_user_id: int):
        upload = self._get_upload(graph.upload_id, curr_user_id)
        path = Path(upload.filepath)
        ext = path.suffix.lower()
        try:
            df = file_parser.load_df(path)
        except FileParserError as e:
            raise HTTPException(status_code=422, detail=str(e))
        return self._aggregate_data(df, graph.chart_type, graph.x_axis, graph.y_axis, graph.aggregation_func,
                                    graph.limit)

    def create_graph(self, graph: GraphBase, user_id: int) -> Graph:
        self._get_upload(graph.upload_id, user_id)
        return self.graph_repo.create(
            title = graph.title,
            chart_type = graph.chart_type,
            upload_id = graph.upload_id,
            user_id = user_id,
            x_axis = graph.x_axis,
            y_axis = graph.y_axis,
            aggregation_func = graph.aggregation_func or None,
            limit = graph.limit or 10
        )

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
        return self.graph_repo.get_graphs_by_user_id(user_id)

    def delete_graph(self, graph_id: int, user_id: int):
        graph = self.graph_repo.get(graph_id)
        if not graph:
            raise HTTPException(status_code=404, detail="График не найден")
        if graph.user_id != user_id:
            raise HTTPException(status_code=403, detail="Нет доступа к удалению этого объекта")
        self.graph_repo.delete(graph_id)