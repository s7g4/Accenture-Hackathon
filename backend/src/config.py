import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()  # Load environment variables from .env file

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "AI Recruitment Platform"
    API_V1_STR: str = "/api"

    # MongoDB settings
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "recruitment_db")

    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key_here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Email settings (optional)
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")

    # OAuth2 settings
    OAUTH2_TOKEN_URL: str = "/api/auth/token"

settings = Settings()

# OAuth2 scheme
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=settings.OAUTH2_TOKEN_URL)
