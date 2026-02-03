import os
import google.generativeai as genai
from dotenv import load_dotenv
from pypdf import PdfReader
import io

# 1. Load Keys
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY_2"))

# 2. Configure Model
model = genai.GenerativeModel('gemini-3-flash-preview')

def generate_review_response(review_text, business_name="Our Company"):
    """
    Analyzes a customer review and drafts a professional response.
    """
    
    prompt = f"""
    You are a Senior Public Relations Manager for {business_name}. 
    Your job is to write a reply to the following customer review.

    CUSTOMER REVIEW:
    "{review_text}"

    INSTRUCTIONS:
    1. Analyze the sentiment (Positive, Negative, or Neutral).
    2. IF NEGATIVE:
       - Be empathetic and professional. 
       - Do NOT get defensive.
       - Acknowledge their specific complaint.
       - Offer a solution (e.g., "Please email us at support@{business_name.lower().replace(' ', '')}.com so we can fix this").
       - Sign off as "Customer Success Team".
    
    3. IF POSITIVE:
       - Thank them enthusiastically.
       - Mention the specific thing they liked.
       - Invite them back soon.

    4. Output ONLY the response text. Do not add quotes or "Here is the draft".
    """

    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}