# ml/cv_parser.py
import fitz  # PyMuPDF

def parse_resume(file_path: str) -> dict:
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()

    # Example: crude extraction
    skills = [word for word in text.split() if word.lower() in {"python", "java", "react", "docker"}]
    return {
        "full_text": text,
        "extracted_skills": list(set(skills))
    }
