from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List
from ..database.mongo import db
from ..utils.jwt_handler import get_current_user

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"},
        500: {"description": "Internal server error"}
    }
)

class Job(BaseModel):
    title: str = Field(..., example="Senior Python Developer", description="Job title")
    description: str = Field(..., example="Looking for experienced Python developer", description="Detailed job description")
    location: str = Field(..., example="Remote", description="Job location")
    skills_required: List[str] = Field(..., example=["Python", "FastAPI"], description="Required skills")

class JobResponse(BaseModel):
    message: str = Field(..., example="Job posted successfully", description="Operation result")

@router.post(
    "/job",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Post new job",
    description="Create a new job posting",
    responses={
        201: {"description": "Job created successfully"},
        403: {"description": "Only recruiters can post jobs"}
    }
)
async def post_job(job: Job, user=Depends(get_current_user)):
    if user["role"] != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")
    job_data = job.dict()
    job_data["posted_by"] = user["email"]
    db.jobs.insert_one(job_data)
    return {"message": "Job posted successfully"}

@router.get(
    "/jobs",
    response_model=List[Job],
    summary="Get recruiter's jobs",
    description="Retrieve all jobs posted by the recruiter",
    responses={
        200: {"description": "Jobs retrieved successfully"},
        403: {"description": "Only recruiters can view their jobs"}
    }
)
async def get_jobs(user=Depends(get_current_user)):
    if user["role"] != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can view their jobs")
    jobs = list(db.jobs.find({"posted_by": user["email"]}, {"_id": 0}))
    return jobs
