from fastapi import APIRouter, Depends, HTTPException
from database.mongo import db
from utils.jwt_handler import get_current_user

router = APIRouter()

@router.get("/jobs")
def list_all_jobs(user=Depends(get_current_user)):
    jobs = list(db.jobs.find({}, {"_id": 0}))
    return jobs

@router.get("/match")
def match_jobs(user=Depends(get_current_user)):
    if user["role"] != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can view matched jobs")

    profile = db.candidates.find_one({"email": user["email"]})
    if not profile or "skills" not in profile:
        raise HTTPException(status_code=404, detail="Candidate profile or skills not found")

    candidate_skills = set(map(str.lower, profile["skills"]))
    all_jobs = list(db.jobs.find())
    matched_jobs = []

    for job in all_jobs:
        job_skills = set(map(str.lower, job["skills_required"].split(",")))
        if candidate_skills & job_skills:  # intersection exists
            job["_id"] = str(job["_id"])
            matched_jobs.append(job)

    return matched_jobs
