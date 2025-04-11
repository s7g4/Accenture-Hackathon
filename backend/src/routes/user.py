from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from src.models.user import UserBase, UserInDB
from src.database.mongo import get_database
from datetime import datetime
import os

router = APIRouter()

@router.get("/profile")
async def get_user_profile(email: str, db=Depends(get_database)):
    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/resume")
async def upload_resume(
    email: str,
    file: UploadFile = File(...),
    db=Depends(get_database)
):
    content = await file.read()
    await db["resumes"].insert_one({
        "email": email,
        "filename": file.filename,
        "content": content,
        "uploaded_at": datetime.now()
    })
    return {"message": "Resume uploaded successfully"}
