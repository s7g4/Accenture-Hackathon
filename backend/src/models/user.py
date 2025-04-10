from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"

class UserBase(BaseModel):
    email: EmailStr = Field(..., example="user@example.com", description="User's email address")
    role: UserRole = Field(..., example="candidate", description="User role (recruiter/candidate)")

class UserCreate(UserBase):
    password: str = Field(..., 
        min_length=8,
        example="SecurePassword123",
        description="User password (min 8 characters with at least one uppercase, one lowercase and one digit)",
        pattern="[A-Za-z\d]{8,}"
    )

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="user@example.com", description="Registered email address")
    password: str = Field(..., example="securepassword123", description="Account password")

class TokenData(BaseModel):
    email: Optional[str] = Field(None, example="user@example.com", description="User email from token")
    role: Optional[str] = Field(None, example="candidate", description="User role from token")

class UserInDB(UserBase):
    hashed_password: str = Field(..., description="BCrypt hashed password")
