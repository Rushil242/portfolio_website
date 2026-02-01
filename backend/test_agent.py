import requests

# The URL of your local backend
url = "http://127.0.0.1:8000/api/agent/invoice"

# Open the image file
with open("test_invoice.png", "rb") as f:
    # Send a POST request with the file
    response = requests.post(url, files={"file": f})

# Print the result
print("Status Code:", response.status_code)
print("AI Response:", response.json())