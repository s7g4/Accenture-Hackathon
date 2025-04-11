# MongoDB Atlas Setup Guide

1. Go to https://www.mongodb.com/atlas/database and create an account
2. Create a new project called "AI Recruitment"
3. Build a new cluster (free tier available)
   - Select cloud provider and region closest to you
   - Choose M0 Sandbox (free) tier
   - Create cluster (takes ~5-10 minutes)

4. Under Database Access:
   - Create database user with read/write access
   - Note down username and password

5. Under Network Access:
   - Add IP address 0.0.0.0/0 (temporary for testing)
   - For production, restrict to your deployment platform's IP

6. Under Database > Collections:
   - Create database named "recruitment_prod"
   - Collections will be created automatically by the application

7. Get Connection String:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace in .env.production:
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/recruitment_prod?retryWrites=true&w=majority
