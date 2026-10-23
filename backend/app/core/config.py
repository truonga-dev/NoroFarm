import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NoroFarm Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = "your-super-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30 # 30 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Email token (shorter-lived, for password reset & email verification)
    EMAIL_TOKEN_EXPIRE_HOURS: int = 24

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Database (direct env var takes priority)
    SUPABASE_DB_URL: str = ""
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "norofarm"
    POSTGRES_PORT: str = "5432"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.SUPABASE_DB_URL:
            return self.SUPABASE_DB_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # SMTP Email Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True
    EMAIL_FROM_NAME: str = "NoroFarm"
    EMAIL_FROM_ADDRESS: str = ""

    # Frontend URL (for email links)
    FRONTEND_URL: str = "http://localhost:3000"

    # OpenTelemetry
    OTLP_ENDPOINT: str = ""

    # External APIs
    OPENWEATHER_API_KEY: str = ""

    # Web Push VAPID Keys
    VAPID_PUBLIC_KEY: str = "BCRXsm1J0zldDKZhzhqmaOqLrFQg8ZXcvcaWOR8qJfjygzUyGGL5FkmS9889fkDT_hpnT0bW965LzXqCicc5wQE"
    VAPID_PRIVATE_KEY: str = "8cX_MNkZ8C48s85apnKAfNBre1cPQDiODCTagrR4woM"
    VAPID_CLAIM_EMAIL: str = "mailto:admin@norofarm.vn"

    # Stripe Settings
    STRIPE_API_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
