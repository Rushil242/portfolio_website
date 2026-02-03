from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Import your agents
from agents.invoice_agent import process_invoice
from agents.sop_agent import answer_sop_question
from agents.review_agent import generate_review_response
from pydantic import BaseModel # We need this for the request body
from typing import List, Dict # Need this for the list of messages
import json
from agents.sales_agent import qualify_lead, score_lead # Import the new scorer

#
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add this class near the top, after imports
class ReviewRequest(BaseModel):
    review: str
    business_name: str = "My Business"

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class SalesChatRequest(BaseModel):
    history: List[ChatMessage] # The previous conversation
    message: str               # The new message

@app.get("/")
def home():
    return {"status": "Portfolio Backend Live"}

# --- AGENT 1: INVOICE EXTRACTOR ---
@app.post("/api/agent/invoice")
async def analyze_invoice(file: UploadFile = File(...)):
    try:
        # Safety Check for MIME type
        mime_type = file.content_type if file.content_type else "image/jpeg"

        file_bytes = await file.read()
        result = process_invoice(file_bytes, mime_type)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- AGENT 2: SOP MANUAL CHAT (New) ---
@app.post("/api/agent/sop")
async def chat_with_sop(
    file: UploadFile = File(...), 
    question: str = Form(...) 
):
    """
    Receives a PDF file AND a text question in the same request.
    """
    try:
        file_bytes = await file.read()
        
        # Call the SOP agent logic
        result = answer_sop_question(file_bytes, question)
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# --- AGENT 3: REVIEW DEFENDER ---
@app.post("/api/agent/review")
async def draft_review_reply(request: ReviewRequest):
    try:
        # Call the agent
        result = generate_review_response(request.review, request.business_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# --- AGENT 4: SALES LEAD QUALIFIER ---
@app.post("/api/agent/sales")
async def sales_chat(request: SalesChatRequest):
    try:
        # 1. Prepare history
        history_dicts = [{"role": m.role, "content": m.content} for m in request.history]
        
        # 2. Get Bot Response
        bot_response = qualify_lead(history_dicts, request.message)
        
        # 3. CHECK: Is the conversation finished?
        # We look for the "magic phrase" we put in the system prompt
        if "Thank you" in bot_response and "qualified" in bot_response:
            
            # --- THE MAGIC: TRIGGER SCORING ---
            # Append the final exchange so the scorer sees it
            full_history = history_dicts + [
                {"role": "user", "content": request.message},
                {"role": "assistant", "content": bot_response}
            ]
            
            # Run the "Brain"
            lead_data = score_lead(full_history)
            
            # Save to "Database" (leads_db.json)
            try:
                with open("leads_db.json", "r+") as f:
                    leads = json.load(f)
                    leads.append(lead_data)
                    f.seek(0)
                    json.dump(leads, f, indent=2)
            except FileNotFoundError:
                with open("leads_db.json", "w") as f:
                    json.dump([lead_data], f)
            
            # Add a secret flag to the response so frontend knows to update the "Excel Sheet"
            return {"response": bot_response, "lead_captured": True, "data": lead_data}

        return {"response": bot_response, "lead_captured": False}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW ENDPOINT: GET THE EXCEL SHEET ---
@app.get("/api/leads")
def get_leads():
    try:
        with open("leads_db.json", "r") as f:
            leads = json.load(f)
        # Sort by Score (Highest First) -> This is the "Ranking" you asked for
        sorted_leads = sorted(leads, key=lambda x: x['lead_score'], reverse=True)
        return sorted_leads
    except:
        return []