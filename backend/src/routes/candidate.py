from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List
from ..database.mongo import db
from ..utils.jwt_handler import get_current_user

router = APIRouter(
    prefix="/candidate",
    tags=["Candidate"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"},
        500: {"description": "Internal server error"}
    }
)

class CandidateProfile(BaseModel):
    bio: str = Field(..., example="Experienced software engineer", description="Candidate's professional bio")
    skills: List[str] = Field(..., example=["Python", "FastAPI"], description="List of candidate's skills")
    location: str = Field(..., example="San Francisco, CA", description="Candidate's location")
    resume: str = Field(..., example="https://storage.example.com/resume.pdf", description="URL to candidate's resume")

class ProfileResponse(BaseModel):
    message: str = Field(..., example="Profile saved", description="Operation result")

@router.post(
    "/profile",
    response_model=ProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Save candidate profile",
    description="Save or update candidate profile information",
    responses={
        200: {"description": "Profile saved successfully"},
        403: {"description": "Only candidates can access this route"}
    }
)
async def save_profile(profile: CandidateProfile, user=Depends(get_current_user)):
    if user["role"] != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can access this route")
    db.candidates.update_one({"email": user["email"]}, {"$set": profile.dict()}, upsert=True)
    return {"message": "Profile saved"}

@router.get(
    "/profile",
    response_model=CandidateProfile,
    summary="Get candidate profile",
    description="Retrieve candidate profile information",
    responses={
        200: {"description": "Profile retrieved successfully"},
        403: {"description": "Only candidates can access this route"},
        404: {"description": "Profile not found"}
    }
)
async def get_profile(user=Depends(get_current_user)):
    if user["role"] != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can access this route")
    profile = db.candidates.find_one({"email": user["email"]}, {"_id": 0})
    if profile:
        return profile
    return {"name": "", "education": "", "experience": "", "skills": ""}

