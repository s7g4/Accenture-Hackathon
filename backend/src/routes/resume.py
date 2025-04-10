from fastapi import APIRouter, UploadFile, File
import pdfplumber
from database import resumes_collection

router = APIRouter()

@router.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    with pdfplumber.open(file.file) as pdf:
        text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())

    resume_data = {
        "filename": file.filename,
        "content": text
    }

    resumes_collection.insert_one(resume_data)
    return {"msg": "Resume uploaded successfully", "extracted_text": text[:500]}  # sample output
