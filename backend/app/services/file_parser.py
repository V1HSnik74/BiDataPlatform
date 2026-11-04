import json
from pathlib import Path
from typing import Tuple, List, BinaryIO

import pandas as pd


class FileParserError(Exception):
    pass


class FileParser:
    SUPPORTED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json", ".xml"}

    def parse_to_df(self, file_obj: BinaryIO, ext: str) -> pd.DataFrame:
        try:
            if ext == ".csv":
                df = pd.read_csv(file_obj)
            elif ext in {".xlsx", ".xls"}:
                df = pd.read_excel(file_obj)
            elif ext == ".json":
                data = json.load(file_obj)
                if isinstance(data, list):
                    df = pd.json_normalize(data)
                elif isinstance(data, dict):
                    for val in data.values():
                        if isinstance(val, list):
                            df = pd.json_normalize(val)
                            break
                    else:
                        df = pd.json_normalize([data])
                else:
                    raise FileParserError("Невалидная JSON структура")
            elif ext == ".xml":
                df = pd.read_xml(file_obj)
            df.columns = [str(col).strip() for col in df.columns]
            return df
        except Exception as e:
            raise FileParserError(f"Не удалось распарсить файл {file_obj}: {str(e)}")

    def load_df(self, path: Path, nrows: int | None = None) -> pd.DataFrame:
        df = pd.read_parquet(path, engine="pyarrow")
        if nrows:
            df = df.head(nrows)
        return df

    def get_dimensions_and_measures(self, path: Path) -> Tuple[List[str], List[str]]:
        df = self.load_df(path, 100)
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
