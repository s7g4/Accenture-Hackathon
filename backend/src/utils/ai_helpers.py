import openai

def generate_questions(job_role: str):
    prompt = f"Generate 5 interview questions for a {job_role} position."
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['choices'][0]['message']['content']
