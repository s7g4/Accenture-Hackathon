from motor.motor_asyncio import AsyncIOMotorClient
from ..config import settings
from fastapi import Depends

# Initialize MongoDB client
client = AsyncIOMotorClient(settings.MONGO_URI)

# Reference the database
db = client[settings.MONGO_DB_NAME]

# Collections (you can access them like db["users"], or use aliases below)
users_collection = db["users"]
jobs_collection = db["jobs"]
applications_collection = db["applications"]
resumes_collection = db["resumes"]
matches_collection = db["matches"]

async def get_database():
    try:
        yield db
    finally:
        pass  # Connection is managed by FastAPI lifespan events
