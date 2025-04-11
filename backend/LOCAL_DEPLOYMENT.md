# AI Recruitment Platform - Local Deployment Guide

## Prerequisites
1. Python 3.9+ installed
2. MongoDB (local or Atlas)
3. Virtual environment (recommended)

## Setup Steps

### 1. Install MongoDB
Option A: Local MongoDB
```bash
# For Ubuntu/Debian
sudo apt-get install mongodb

# For MacOS
brew tap mongodb/brew
brew install mongodb-community
mongod --config /usr/local/etc/mongod.conf
```

Option B: Use MongoDB Atlas (free tier)
- Follow MongoDB_Atlas_Setup.md
- Use connection string for local testing

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Install Dependencies
```bash
# Make sure pip is up to date
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt

# Verify critical packages are installed
pip install fastapi uvicorn passlib python-jose pymongo
```

### 4. Configure Environment
Create `.env` file:
```bash
MONGO_URI=mongodb://localhost:27017  # or your Atlas URI
MONGO_DB_NAME=recruitment_dev
SECRET_KEY=your_local_secret_key
```

### 5. Run Application
```bash
# From the backend directory:
cd /home/shaurya/Desktop/Accenture-Hackathon/backend
uvicorn src.main:app --reload

# Alternative if you want to run from outside:
PYTHONPATH=/home/shaurya/Desktop/Accenture-Hackathon/backend uvicorn src.main:app --reload
```

### 6. Test API
Access at: http://localhost:8000

Test endpoints:
- GET / - Should return welcome message
- POST /api/auth/register - Test user registration
