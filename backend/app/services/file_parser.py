import json
from pathlib import Path
from typing import Tuple, List

import pandas as pd


class FileParserError(Exception):
    pass


class FileParser:
    SUPPORTED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json", ".xml"}

    def parse_columns(self, filepath: str) -> Tuple[List[str], List[str]]:
        path = Path(filepath)
        ext = path.suffix.lower()
        if ext not in self.SUPPORTED_EXTENSIONS:
            raise FileParserError(f"Формат файла {ext} не поддерживается")
        df = self._load_df(path, ext)
        return self._get_dimensions_and_measures(df)

    def _load_df(self, path: Path, ext: str) -> pd.DataFrame:
        try:
            if ext == ".csv":
                return pd.read_csv(path, nrows=100)
            elif ext in {".xlsx", ".xls"}:
                return pd.read_excel(path, nrows=100)
            elif ext == ".json":
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                if isinstance(data, list):
                    return pd.json_normalize(data[:100])
                elif isinstance(data, dict):
                    for key, val in data.items():
                        if isinstance(val, list):
                            return pd.json_normalize(val[:100])
                    return pd.json_normalize([data])
                else:
                    raise FileParserError("Невалидная JSON структура")
            elif ext == ".xml":
                return pd.read_xml(path)
        except Exception as e:
            raise FileParserError(f"Не удалось распарсить файл {path.name}: {str(e)}")

    def _get_dimensions_and_measures(self, df: pd.DataFrame) -> Tuple[List[str], List[str]]:
        df.columns = [str(col).strip() for col in df.columns]
        clean_cols = [
            col for col in df.columns
            if not col.lower().startswith("unnamed:") and df[col].notna().any()
        ]
        df = df[clean_cols]
        measures = []
        dimensions = []
        for col in df.columns:
            col_lower = col.lower()
            is_id_column = (
                col_lower == "id"
                or col_lower.endswith("_id")
                or col_lower.endswith("id")
                or "guid" in col_lower
            )
            if pd.api.types.is_numeric_dtype(df[col]):
                if is_id_column:
                    dimensions.append(col)
                else:
                    measures.append(col)
            else:
                dimensions.append(col)
        return dimensions, measures

file_parser = FileParser()
