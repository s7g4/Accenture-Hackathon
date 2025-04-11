from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
import pdfplumber
from pydantic import BaseModel, Field
from ..database.mongo import get_database
from typing import Dict, Any

router = APIRouter(
    prefix="/resume",
    tags=["Resume Processing"],
    responses={
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"},
        500: {"description": "Internal server error"}
    }
)

class ResumeResponse(BaseModel):
    msg: str = Field(..., example="Resume uploaded successfully", description="Operation result")
    extracted_text: str = Field(..., example="Sample extracted text...", description="First 500 characters of extracted text")

@router.post(
    "/upload",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and parse resume",
    description="Upload a PDF resume and extract its text content",
    responses={
        201: {"description": "Resume processed successfully"},
        400: {"description": "Invalid file format"},
        500: {"description": "Error processing resume"}
    }
)
async def upload_resume(
    file: UploadFile = File(..., description="PDF resume file to upload"),
    db=Depends(get_database)
):
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
