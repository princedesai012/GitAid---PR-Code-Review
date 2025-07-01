import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def review_code_snippet(code: str, language: str = "python"):
    try:
        model = genai.GenerativeModel("gemini-2.5-pro")

        prompt = f"""
You're a strict senior {language} code reviewer.

Your task:
- Only list actual **problems or anti-patterns** in the code.
- For each, briefly explain **why it's wrong** and how to fix it.
- Maximum **5 bullet points**.
- **Do NOT** include summaries, compliments, or code rewrites.
- Format as: 
  • [Issue] → [Short fix or advice]

Code:
```{language}
{code}
```"""

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Gemini API error: {str(e)}"
