from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from pydantic import BaseModel, Field
from ..database.mongo import get_database
from ..utils.jwt_handler import get_current_user
from typing import List, Dict, Any

router = APIRouter(
    prefix="/match",
    tags=["Matching"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"},
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

class JobMatch(BaseModel):
    title: str = Field(..., description="Job title")
    description: str = Field(..., description="Job description")
    location: str = Field(..., description="Job location")
    skills_required: List[str] = Field(..., description="Required skills")

class MatchResponse(BaseModel):
    message: str = Field(..., description="Operation result")

@router.get(
    "/jobs",
    response_model=List[JobMatch],
    summary="List all jobs",
    description="Get a list of all available jobs",
    responses={
        200: {"description": "Jobs retrieved successfully"}
    }
)
async def list_all_jobs(
    user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    jobs = await db["jobs"].find({}, {"_id": 0}).to_list(length=100)
    return jobs

@router.get(
    "/",
    response_model=List[JobMatch],
    summary="Match jobs to candidate",
    description="Find jobs matching candidate's skills",
    responses={
        200: {"description": "Matching jobs found"},
        403: {"description": "Only candidates can view matched jobs"},
        404: {"description": "Candidate profile or skills not found"}
    }
)
async def match_jobs(
    user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    if user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can view matched jobs")

    profile = await db["candidates"].find_one({"email": user["email"]})
    if not profile or "skills" not in profile:
        raise HTTPException(status_code=404, detail="Candidate profile or skills not found")

    candidate_skills = set(map(str.lower, profile["skills"]))
    all_jobs = await db["jobs"].find().to_list(length=100)
    matched_jobs = []

    for job in all_jobs:
        job_skills = set(map(str.lower, job["skills_required"].split(",")))
        if candidate_skills & job_skills:  # intersection exists
            job["_id"] = str(job["_id"])
            matched_jobs.append(job)

    return matched_jobs

@router.post(
    "/save",
    response_model=MatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save match results",
    description="Save job matches for a candidate",
    responses={
        201: {"description": "Match results saved successfully"},
        403: {"description": "Only recruiters can save matches"}
    }
)
async def save_match_results(
    *,
    candidate_email: str = Query(..., description="Candidate email address"),
    matched_jobs: List[JobMatch] = Body(..., description="List of matched jobs"),
    user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    if user.get("role") != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can save matches")
    
    await db["matches"].insert_one({
        "email": candidate_email,
        "results": matched_jobs,
        "created_by": user["email"]
    })
    return {"message": "Match results saved successfully"}
