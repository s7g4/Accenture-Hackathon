# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth  # make sure you have __init__.py in routes/
from routes import auth, user, candidate, recruiter, match  # ✅ Import new routes

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

# Optional: Root endpoint
@app.get("/")
def root():
    return {"message": "AI Recruitment API is live 🎯"}

