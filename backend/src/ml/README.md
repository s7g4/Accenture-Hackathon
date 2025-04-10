# Job Matcher ML Module

This module provides a simple machine learning-powered matching system using TF-IDF and cosine similarity.

## Files

- `job_matcher.py`: Core logic to match resume text against job descriptions.
- `model.pkl`: Serialized TF-IDF model.
- `train_model.py`: (Optional) Script to train and save the model.
- `README.md`: This documentation.

## Usage

```python
from ml.job_matcher import JobMatcher

matcher = JobMatcher()

resume = "Python backend developer experienced in FastAPI and MongoDB"
jobs = [
    "Frontend Developer with React",
    "Backend Engineer skilled in Python and FastAPI",
    "Data Analyst with Tableau skills"
]

matches = matcher.match(resume, jobs)
print(matches)
