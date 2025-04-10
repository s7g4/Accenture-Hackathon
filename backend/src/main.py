from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from src.routes import auth, user, match, recruiter, candidate, resume
from typing import List

security = HTTPBearer()

app = FastAPI(
    title="AI Recruitment Framework",
    description="This API powers job matching, candidate parsing, job posting, and more using AI-based tools.",
    version="1.0.0",
)

# CORS config
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route files with proper tagging
app.include_router(auth.router, tags=["Authentication"])
app.include_router(user.router, tags=["User Management"])
app.include_router(match.router, tags=["AI Matching"])
app.include_router(recruiter.router, tags=["Recruiter"])
app.include_router(candidate.router, tags=["Candidate"])
app.include_router(resume.router, tags=["Resume Processing"])

@app.get("/")
def root():
    return {"message": "AI Recruitment API is live 🎯"}
