# Topic- Enhancing Job Screening with AI and Data Intelligence

## **Challenge Overview:**
The recruitment process often involves manually reviewing numerous job descriptions (JDs) and CVs, which can be time-consuming and prone to human error. The goal of this hackathon is to develop a multi-agentic AI system that can automatically read and summarize job descriptions (JDs), match candidate qualifications with the JD, shortlist candidates, and send interview requests based on the match

### Current Process:
Job Description Summarizer: Reads and summarizes key elements from the JD, including required skills, experience, qualifications, and job responsibilities.

Recruiting agent: Extracts key data from CVs, such as education, work experience, skills, certifications, and other relevant information. Compares the extracted data from the CV to the summarized JD and calculates a match score based on the relevance of the candidate's qualifications, experience, and skills.

Shortlisting Candidates: Based on the match score, candidates who meet or exceed a defined threshold (e.g., 80% match) are shortlisted for interviews.

Interview Scheduler: Sends personalized interview requests to shortlisted candidates, including potential dates, times, and interview format written in email.

### Expected Technical Output:
Multiagent framework and SQLite Database for long term memory

## Solution
**Make all this available in different languages later**
### JD Summarizer Agent
Takes the CV as the input and returns a structured summary with `skills`, `experience`, `qualifications` and `responsibilities`

### CV Parser & Matching Agent
Takes the CV as input and returns (Extracted structured candidate info (education, skills, work experience, etc.), Match score based on JD summary) (Uses the above JD Summarizer Agent)

### Shortlisting Agent
Compares match score and shortlists if falls in the criteria. Takes in a list of CVs and returns a list of the shortlisted employees. This also returns a reason? for rejection

### Interview Scheduler Agent
Takes the Candidate `name`, `email` and `position` and returns an email with timeslots, format and meeting link (provided by the company)

**All the Agents are made in Python** so look into LangChain

### Rust Backend
This can be used to send the email and run the Python code in the application. Add some auth
[Link to GMail API](https://developers.google.com/workspace/gmail/api/quickstart/js)

### NextJs Frontend
This is kinda more important? since this will be in the video. Will make a barely working one with basic email sending algorithm. Can use websockets for real time chatbot type shit
