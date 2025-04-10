from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import pdfplumber
from ..database.mongo import resumes_collection
from ..database.mongo import get_database
from typing import Dict, Any

router = APIRouter()

@router.post("/upload-resume/")
async def upload_resume(
    file: UploadFile = File(...),
    db=Depends(get_database)
) -> Dict[str, Any]:
    try:
        with pdfplumber.open(file.file) as pdf:
            text = "\n".join(
                page.extract_text() 
                for page in pdf.pages 
                if page.extract_text()
            )

        resume_data = {
            "filename": file.filename,
            "content": text
        }

        await db["resumes"].insert_one(resume_data)
        return {
            "msg": "Resume uploaded successfully", 
            "extracted_text": text[:500]  # sample output
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )
