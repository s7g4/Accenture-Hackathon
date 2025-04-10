from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

class Query(BaseModel):
    message: str

@router.post("/chat")
async def chatbot_reply(query: Query):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": query.message}]
    )
    return {"reply": response['choices'][0]['message']['content']}
