from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database.mongo import db
from utils.jwt_handler import get_current_user

router = APIRouter()

class CandidateProfile(BaseModel):
    bio: str
    skills: str
    location: str
    resume: str

@router.post("/candidate/profile")
def save_profile(profile: CandidateProfile, user=Depends(get_current_user)):
    if user["role"] != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can access this route")
    db.candidates.update_one({"email": user["email"]}, {"$set": profile.dict()}, upsert=True)
    return {"message": "Profile saved"}

@router.get("/candidate/profile")
def get_profile(user=Depends(get_current_user)):
    if user["role"] != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can access this route")
    profile = db.candidates.find_one({"email": user["email"]}, {"_id": 0})
    if profile:
        return profile
    return {"name": "", "education": "", "experience": "", "skills": ""}

