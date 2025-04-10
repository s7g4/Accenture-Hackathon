# models/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from mongo import users_collection, resumes_collection

# Get user profile
user = await users_collection.find_one({"email": current_user.email})

# Save resume file
await resumes_collection.insert_one({
    "email": current_user.email,
    "filename": resume.filename,
    "content": content
})

class UserBase(BaseModel):
    email: EmailStr
    role: str  # "candidate" or "recruiter"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
