from pathlib import Path

from pydantic_settings import SettingsConfigDict, BaseSettings
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str = 'localhost'
    POSTGRES_PORT: int = 5433
    SECRET_KEY: str
    POSTGRES_DB: str = 'bi_db'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    @property
    def db_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    model_config = SettingsConfigDict(
        env_file=(BASE_DIR / '.env'),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()