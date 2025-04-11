from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["ai_recruitment"]
users_collection = db["users"]
resumes_collection = db["resumes"]
