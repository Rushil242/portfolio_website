from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents.invoice_agent import process_invoice  # <--- IMPORT OUR NEW AGENT

app = FastAPI()

# Enable CORS (Allows Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only. In production, we'll list specific domains.
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
    """
    Receives an uploaded file, reads the bytes, and sends to Gemini.
    """
    try:
        # 1. Read the file bytes
        file_bytes = await file.read()
        mime_type = file.content_type
        # 2. Send to our Agent Logic
        # We pass the bytes and the file type (e.g., image/jpeg)
        result = process_invoice(file_data=file_bytes, mime_type=mime_type)
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))