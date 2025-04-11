# AI Recruitment Platform - Cloud Deployment Guide

## Prerequisites
1. MongoDB Atlas account (setup completed via MongoDB_Atlas_Setup.md)
2. Render account (https://render.com)
3. GitHub account (for repository connection)

## Deployment Steps

### 1. Configure Environment
- Fill in .env.production with your actual values:
  - MONGO_URI from Atlas connection string
  - SECRET_KEY (generate a strong random string)
  - Optional email/SMTP settings if needed

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. Deploy to Render
1. Go to Render Dashboard
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - Name: ai-recruitment-backend
   - Region: Choose closest to your users
   - Branch: main
   - Runtime: Docker
   - Auto-deploy: Yes
5. Add environment variables from .env.production
6. Click "Create Web Service"

### 4. Verify Deployment
1. Wait for build to complete (5-10 minutes)
2. Check logs for errors
3. Access API at provided Render URL
4. Test endpoints:
   - GET / (should return welcome message)
   - POST /api/auth/register (test user registration)

## Post-Deployment
1. Set up custom domain (optional)
2. Configure HTTPS
3. Set up monitoring and alerts
