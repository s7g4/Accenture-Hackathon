# services/interview_scheduler.py
from datetime import datetime
from typing import Dict

def schedule_interview(candidate_email: str, recruiter_email: str, datetime_str: str) -> Dict:
    dt = datetime.fromisoformat(datetime_str)
    # In a real app, you'd add to calendar or send email
    return {
        "status": "scheduled",
        "candidate": candidate_email,
        "recruiter": recruiter_email,
        "time": dt.isoformat()
    }
