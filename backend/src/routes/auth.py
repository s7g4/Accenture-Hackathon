# routes/auth.py

from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordBearer
from pydantic import Field
from passlib.context import CryptContext
from jose import jwt, JWTError
from ..models.user import UserCreate, UserLogin, TokenData
from ..database.mongo import get_database
from datetime import datetime, timedelta
import os

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={
        400: {"description": "Bad request"},
        401: {"description": "Unauthorized"},
        500: {"description": "Internal server error"}
    }
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret & algorithm
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_pw, hashed_pw) -> bool:
    return pwd_context.verify(plain_pw, hashed_pw)

def create_token(data: dict, expires_delta: timedelta = timedelta(minutes=60)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return TokenData(email=email, role=role)
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    description="Creates a new user account with email, password and role",
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Email already registered"}
    }
)
async def register(user: UserCreate, db=Depends(get_database)):
    """
    Register a new user with the following information:
    - email: must be unique
    - password: will be hashed before storage
    - role: either 'recruiter' or 'candidate'
    """
    users_collection = db["users"]
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_dict = {
        "email": user.email,
        "hashed_password": hashed_password,
        "role": user.role
    }
    await users_collection.insert_one(user_dict)
    return {"message": "User registered successfully"}

@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="User login",
    description="Authenticate user and return JWT token",
    responses={
        200: {"description": "Successful login with token"},
        401: {"description": "Invalid credentials"}
    }
)
async def login(user: UserLogin, db=Depends(get_database)):
    """
    Authenticate user and return JWT token containing:
    - email: user's email address
    - role: user's role (recruiter/candidate)
    - exp: token expiration time
    """
    users_collection = db["users"]
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": db_user["email"], "role": db_user["role"]})
    return {"access_token": token, "role": db_user["role"]}
