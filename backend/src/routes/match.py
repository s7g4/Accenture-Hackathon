from fastapi import APIRouter, Depends, HTTPException
from ..database.mongo import get_database
from ..utils.jwt_handler import get_current_user
from typing import List, Dict, Any

router = APIRouter()

@router.get("/jobs", response_model=List[Dict[str, Any]])
async def list_all_jobs(
    user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    jobs = await db["jobs"].find({}, {"_id": 0}).to_list(length=100)
    return jobs

@router.get("/match", response_model=List[Dict[str, Any]])
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

@router.post("/save-match")
async def save_match_results(
    candidate_email: str,
    matched_jobs: List[Dict[str, Any]],
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
