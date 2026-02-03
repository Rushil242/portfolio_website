import requests
import time

url_chat = "http://127.0.0.1:8000/api/agent/sales"
url_leads = "http://127.0.0.1:8000/api/leads"

chat_history = []

# ...existing code...
def chat_step(message):
    print(f"\nUser: {message}")
    payload = {"history": chat_history, "message": message}
    
    try:
        # CHANGE HERE: Increased timeout from 5 to 30 seconds
        res = requests.post(url_chat, json=payload, timeout=30).json()
        
        bot_msg = res["response"]
        print(f"Bot: {bot_msg}")
        
        chat_history.append({"role": "user", "content": message})
        chat_history.append({"role": "assistant", "content": bot_msg})
        
        # Check if lead was captured
        if res.get("lead_captured"):
            print("\n[!] LEAD CAPTURED! SCORING RESULTS:")
            print(res["data"])

    except requests.exceptions.ReadTimeout:
        print("\n[Error] The AI took too long to reply. Google's API might be slow right now.")
    except Exception as e:
        print(f"\n[Error] Something else went wrong: {e}")
# ...existing code...

# --- SCENARIO: A "HOT" LEAD ---
print("--- SIMULATING HOT LEAD ---")
chat_step("Hi")
chat_step("My budget is $5000") # High Budget (+Points)
chat_step("I need to move next week") # Urgent (+Points)
chat_step("Downtown Manhattan") 
chat_step("+91 8008527903")# Specific (+Points)

# --- CHECK THE DATABASE ---
print("\n--- CHECKING 'EXCEL SHEET' (DB) ---")
time.sleep(1) # Wait for file save
leads = requests.get(url_leads).json()

print(f"Total Leads in DB: {len(leads)}")
print("Top Ranked Lead:", leads[0])