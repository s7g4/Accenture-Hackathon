from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..database.mongo import db
from ..utils.jwt_handler import get_current_user

router = APIRouter()

class Job(BaseModel):
    title: str
    description: str
    location: str
    skills_required: str

@router.post("/recruiter/job")
def post_job(job: dict, user=Depends(get_current_user)):
    if user["role"] != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can post jobs")
    job_data = job.dict()
    job_data["posted_by"] = user["email"]
    db.jobs.insert_one(job_data)
    return {"message": "Job posted successfully"}

@router.get("/recruiter/jobs")
def get_jobs(user=Depends(get_current_user)):
    if user["role"] != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can view their jobs")
    jobs = list(db.jobs.find({"posted_by": user["email"]}, {"_id": 0}))
    return jobs
