# routes/auth.py

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from models.user import UserCreate, UserLogin, TokenData
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from mongo import users_collection

user = await users_collection.find_one({"email": login.email})
await users_collection.insert_one({...})

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret & algorithm
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Mongo setup (replace with your actual DB URL)
client = MongoClient("mongodb://localhost:27017")
db = client["recruitment_db"]
users_collection = db["users"]

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


@router.post("/register")
def register(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    hashed_pw = hash_password(user.password)
    users_collection.insert_one({
        "email": user.email,
        "role": user.role,
        "hashed_password": hashed_pw
    })

    return {"message": "User registered successfully."}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": db_user["email"], "role": db_user["role"]})
    return {"access_token": token, "role": db_user["role"]}

@router.post("/register")
def register_user(user: UserCreate, db: MongoClient = Depends(get_database)):
    users_collection = db["users"]
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }
    users_collection.insert_one(user_dict)
    return {"message": "Registration successful"}
