from pydantic import BaseModel, EmailStr, Field, root_validator
from typing import Annotated, Optional
from enum import Enum
import re


class UserRole(str, Enum):
    """Enum for user roles."""
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"


class UserBase(BaseModel):
    email: EmailStr = Field(title="User's email address", example="user@example.com")
    role: UserRole = Field(title="User role", example="candidate")


class UserCreate(UserBase):
    password: Annotated[
        str,
        Field(
            min_length=8,
            title="User password",
            description="Password must have at least one uppercase, one lowercase, and one digit",
            example="SecurePassword123"
        )
    ]

    @root_validator(pre=True)
    def validate_password(cls, values):
        password = values.get("password")
        if not password:
            raise ValueError("Password is required")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit")
        return values


class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="user@example.com", description="Registered email address")
    password: str = Field(..., example="securepassword123", description="Account password")


class TokenData(BaseModel):
    email: Optional[EmailStr] = Field(None, example="user@example.com", description="User email from token")
    role: Optional[UserRole] = Field(None, example="candidate", description="User role from token")


class UserInDB(UserBase):
    hashed_password: str = Field(..., description="BCrypt hashed password")
