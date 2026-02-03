# ...existing code...
import requests

url = "http://127.0.0.1:8000/api/agent/review"

# 1. Simulate a BAD Review
bad_review = {
    "review": "I waited 45 minutes for my food and it was cold! The waiter was rude. I am never coming back!",
    "business_name": "Luigi's Pizza"
}

# 2. Simulate a GOOD Review
good_review = {
    "review": "Best pizza in town! The crust was perfect and the staff was so friendly.",
    "business_name": "Luigi's Pizza"
}

def show_response(resp):
    print("Status Code:", resp.status_code)
    try:
        body = resp.json()
    except ValueError:
        print("Non-JSON response:", resp.text)
        return
    print("Response JSON keys:", list(body.keys()))
    if "response" in body:
        print(body["response"])
    elif "detail" in body:
        print("Detail:", body["detail"])
    else:
        print("Full JSON:", body)

print("--- TEST 1: Handling a Bad Review ---")
resp = requests.post(url, json=bad_review)
show_response(resp)

print("\n\n--- TEST 2: Handling a Good Review ---")
resp = requests.post(url, json=good_review)
show_response(resp)
# ...existing code...