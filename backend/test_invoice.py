import requests

# The URL of your local backend
url = "http://127.0.0.1:8000/api/agent/invoice"

# Open the image file
# We MUST tell requests the MIME type (image/jpeg) or FastAPI receives None
file_path = "test_invoice.png"
mime_type = "image/png"  # <--- CRITICAL FIX

with open(file_path, "rb") as f:
    # Format: "key": (filename, file_object, mime_type)
    files = {"file": (file_path, f, mime_type)} 
    
    print(f"Sending {file_path} as {mime_type}...")
    response = requests.post(url, files=files)

# Print the result
print("Status Code:", response.status_code)
print("AI Response:", response.json())