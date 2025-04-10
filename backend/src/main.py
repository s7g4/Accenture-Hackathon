from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, user, match
from typing import List

app = FastAPI(
    title="AI Recruitment Backend",
    description="Backend API for user authentication and recruitment features.",
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

# Include route files
app.include_router(auth.router, tags=["Auth"])
app.include_router(user.router)
app.include_router(match.router)

@app.get("/")
def root():
    return {"message": "AI Recruitment API is live 🎯"}
