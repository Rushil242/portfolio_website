import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load the API Key safely
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 2. Configure Gemini
genai.configure(api_key=api_key)

# 3. Define the Model (Using Flash for speed & cost)
# We force the model to output JSON, which is critical for software.
model = genai.GenerativeModel(
    'gemini-3-flash-preview',
    generation_config={"response_mime_type": "application/json"}
)

def process_invoice(file_data, mime_type):
    """
    Takes raw image data, sends it to Gemini, and extracts structured data.
    """
    
    # The Prompt: This acts as the "System Instruction"
    prompt = """
    You are an expert Data Entry Clerk. 
    Analyze this invoice image and extract the following fields into a clean JSON format:
    - invoice_number (string)
    - date (string, format YYYY-MM-DD)
    - vendor_name (string)
    - total_amount (float)
    - currency (string, e.g., USD, EUR)
    - tax_amount (float, if found, else 0)
    - line_items (list of objects with description and amount)

    If a field is missing, use null. return ONLY the JSON.
    """

    try:
        # Create the image part for Gemini
        image_part = {
            "mime_type": mime_type,
            "data": file_data
        }

        # Send to AI
        response = model.generate_content([prompt, image_part])
        
        # Parse the JSON string into a real Python dictionary
        return json.loads(response.text)

    except Exception as e:
        return {"error": str(e), "status": "failed"}