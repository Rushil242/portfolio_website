from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json

# Import your agents
from agents.invoice_agent import process_invoice
from agents.sop_agent import answer_sop_question
from agents.sales_agent import qualify_lead, score_lead # <--- Ensure score_lead is imported!
from agents.review_agent import generate_review_response

app = FastAPI()

# Enable CORS (Allows Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all domains (Important for Codespaces)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Portfolio Backend Live"}

# --- AGENT 1: INVOICE EXTRACTOR ---
@app.post("/api/agent/invoice")
async def analyze_invoice(file: UploadFile = File(...)):
    try:
        mime_type = file.content_type if file.content_type else "image/jpeg"
        file_bytes = await file.read()
        return process_invoice(file_bytes, mime_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- AGENT 2: SOP MANUAL CHAT ---
@app.post("/api/agent/sop")
async def chat_with_sop(file: UploadFile = File(...), question: str = Form(...)):
    try:
        file_bytes = await file.read()
        return answer_sop_question(file_bytes, question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- AGENT 3: REVIEW DEFENDER ---
class ReviewRequest(BaseModel):
    review: str
    business_name: str = "My Business"

@app.post("/api/agent/review")
async def draft_review_reply(request: ReviewRequest):
    try:
        return generate_review_response(request.review, request.business_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- AGENT 4: SALES LEAD QUALIFIER ---
class ChatMessage(BaseModel):
    role: str
    content: str

class SalesChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str

@app.post("/api/agent/sales")
async def sales_chat(request: SalesChatRequest):
    try:
        # 1. Prepare history
        history_dicts = [{"role": m.role, "content": m.content} for m in request.history]
        
        # 2. Get Bot Response
        bot_response = qualify_lead(history_dicts, request.message)
        
        # 3. CHECK: Is the conversation finished?
        if "Thank you" in bot_response and "qualified" in bot_response:
            
            # --- TRIGGER SCORING ---
            full_history = history_dicts + [
                {"role": "user", "content": request.message},
                {"role": "assistant", "content": bot_response}
            ]
            lead_data = score_lead(full_history)
            
            # Save to leads_db.json
            try:
                with open("leads_db.json", "r+") as f:
                    try:
                        leads = json.load(f)
                    except json.JSONDecodeError:
                        leads = []
                    leads.append(lead_data)
                    f.seek(0)
                    json.dump(leads, f, indent=2)
            except FileNotFoundError:
                with open("leads_db.json", "w") as f:
                    json.dump([lead_data], f)
            
            return {"response": bot_response, "lead_captured": True, "data": lead_data}

        return {"response": bot_response, "lead_captured": False}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW: GET LEADS ENDPOINT (This was missing!) ---
@app.get("/api/leads")
def get_leads():
    try:
        with open("leads_db.json", "r") as f:
            leads = json.load(f)
        # Return sorted leads (Highest score first)
        return sorted(leads, key=lambda x: x.get('lead_score', 0), reverse=True)
    except:
        return [] # Return empty list if file missing