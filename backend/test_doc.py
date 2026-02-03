import requests

# URL for the new SOP endpoint
url = "http://127.0.0.1:8000/api/agent/sop"

# 1. The Question you want to ask the PDF
# (Change this to something relevant to your specific PDF)
question_text = "What is the summary of this document?"

# 2. The File to upload
file_path = "test_doc.pdf"  # Make sure this file exists in your folder!
mime_type = "application/pdf"

try:
    with open(file_path, "rb") as f:
        # We send both the 'file' and the 'question' (as form data)
        files = {"file": (file_path, f, mime_type)}
        data = {"question": question_text}
        
        print(f"Sending PDF and asking: '{question_text}'...")
        response = requests.post(url, files=files, data=data)

    # 3. Print the Result
    if response.status_code == 200:
        print("\n--- AI Answer ---")
        print(response.json())
    else:
        print("\n--- Error ---")
        print("Status Code:", response.status_code)
        print("Detail:", response.text)

except FileNotFoundError:
    print(f"Error: Could not find '{file_path}'. Please add a dummy PDF to test.")

