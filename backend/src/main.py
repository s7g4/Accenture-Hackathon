# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth  # make sure you have __init__.py in routes/
from routes import auth, user, candidate, recruiter, match  # ✅ Import new routes
from ml.jd_summarizer import summarize_jd
from fastapi import UploadFile, File
from ml.cv_parser import parse_resume
import shutil
from services.shortlisting import shortlist_candidates
from services.interview_scheduler import schedule_interview


app = FastAPI(
    title="AI Recruitment Backend",
    description="Backend API for user authentication and recruitment features.",
    version="1.0.0",
)

# CORS config — allows your frontend to make API requests
origins = [
    "http://localhost:3000",     # Next.js dev server
    "http://127.0.0.1:3000",     # fallback localhost
    # Add production URLs when deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] for all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your route files here
app.include_router(auth.router, tags=["Auth"])
app.include_router(user.router)
app.include_router(candidate.router)   # <-- Add this line
app.include_router(recruiter.router)
app.include_router(match.router)
app.include_router(jd_summarizer.router)
app.include_router(cv_parser.router)
app.include_router(shortlisting.router)
app.include_router(interview_scheduler.router)

# Optional: Root endpoint
@app.get("/")
def root():
    return {"message": "AI Recruitment API is live 🎯"}

@app.post("/summarize-jd")
def summarize_jd_api(payload: dict):
    return summarize_jd(payload["text"])

@app.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):
    with open(f"temp/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return parse_resume(f"temp/{file.filename}")

@app.post("/shortlist")
def shortlist(candidates: List[dict]):
    return shortlist_candidates(candidates)

@app.post("/schedule-interview")
def schedule_interview_api(payload: dict):
    return schedule_interview(payload["candidate"], payload["recruiter"], payload["time"])
