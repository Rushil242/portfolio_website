import os
import google.generativeai as genai
from dotenv import load_dotenv
from pypdf import PdfReader
import io

# 1. Load Keys
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# 2. Configure Model
# We don't force JSON here because we want a natural conversation.
model = genai.GenerativeModel('gemini-3-flash-preview')

def extract_text_from_pdf(file_bytes):
    """
    Helper function to read text from uploaded PDF bytes.
    """
    try:
        # Create a file-like object from the bytes
        pdf_stream = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def answer_sop_question(file_bytes, question):
    """
    Reads the PDF and answers the user's question based ONLY on that content.
    """
    # 1. Get text from the PDF
    pdf_text = extract_text_from_pdf(file_bytes)
    
    # 2. Limit text if it's too huge (Safety mechanism)
    # Gemini Flash handles ~700,000 words easily, but let's be safe.
    if len(pdf_text) > 500000:
        pdf_text = pdf_text[:500000]

    # 3. The "Grounding" Prompt
    # This instructs the AI to ONLY use the provided text.
    prompt = f"""
    You are an expert technical support agent. 
    You have been given the following Reference Document (SOP):
    
    <DOCUMENT_START>
    {pdf_text}
    <DOCUMENT_END>

    USER QUESTION: {question}

    INSTRUCTIONS:
    1. Answer the question using ONLY the information in the Reference Document.
    2. If the answer is not in the document, say "I cannot find that information in the provided document."
    3. Quote specific sections if possible.
    4. Keep the tone professional and concise.
    """

    try:
        response = model.generate_content(prompt)
        return {"answer": response.text}
    except Exception as e:
        return {"error": str(e)}