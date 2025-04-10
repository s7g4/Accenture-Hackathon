# ml/jd_summarizer.py
from typing import Dict
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_jd(jd_text: str) -> Dict:
    summary = summarizer(jd_text, max_length=150, min_length=40, do_sample=False)[0]["summary_text"]
    return {
        "original": jd_text,
        "summary": summary
    }
