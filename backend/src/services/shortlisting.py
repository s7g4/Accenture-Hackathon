# services/shortlisting.py
from typing import List, Dict

def shortlist_candidates(candidates: List[Dict], min_score: float = 0.8) -> List[Dict]:
    return [c for c in candidates if c.get("match_score", 0) >= min_score]
