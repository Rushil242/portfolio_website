import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import re # <--- Import Regex to clean the text

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY_2"))

chat_model = genai.GenerativeModel('gemini-3-flash-preview')

# We STILL use response_mime_type, but we double-check the output
scorer_model = genai.GenerativeModel(
    'gemini-3-flash-preview',
    generation_config={"response_mime_type": "application/json"}
)

def qualify_lead(history, current_message):
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])

    prompt = f"""
    You are "Sarah", a Real Estate Intake Assistant. 
    Goal: Collect Budget, Location, and Move-in Date along with contact number.
    
    Chat History:
    {history_text}
    User: "{current_message}"

    INSTRUCTIONS:
    - Ask for missing info one by one.
    - If you have ALL 3, say exactly: "Thank you! I have qualified your lead."
    - Keep it short.
    """
    response = chat_model.generate_content(prompt)
    return response.text

def score_lead(history):
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
    
    prompt = f"""
    Analyze this Real Estate conversation and extract structured data.
    Then, calculate a 'lead_score' (0-100).
    
    Return JSON with fields: budget, location, timeline, lead_score, status, summary, contact_number.

    Chat History:
    {history_text}
    """
    
    response = scorer_model.generate_content(prompt)
    raw_text = response.text

    # --- THE FIX: Clean the Output ---
    # Sometimes AI returns ```json ... ```. We remove that.
    clean_text = raw_text.strip()
    if clean_text.startswith("```json"):
        clean_text = clean_text[7:]
    if clean_text.startswith("```"):
        clean_text = clean_text[3:]
    if clean_text.endswith("```"):
        clean_text = clean_text[:-3]
    
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        # Fallback if AI really messed up
        return {
            "lead_score": 0, 
            "status": "Error", 
            "summary": "AI Failed to parse data"
        }