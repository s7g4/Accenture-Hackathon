# routes/__init__.py

from .auth import router as auth_router
from .user import router as user_router
from .candidate import router as candidate_router
from .recruiter import router as recruiter_router
from .match import router as match_router
from .resume import router as resume_router

__all__ = [
    "auth_router",
    "user_router",
    "candidate_router",
    "recruiter_router",
    "match_router",
    "resume_router"
]
