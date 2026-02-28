import json

import pytest

pytest.importorskip("fastapi")
from fastapi.testclient import TestClient

import main


client = TestClient(main.app)


def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "Portfolio Backend Live"


def test_review_endpoint():
    payload = {"review": "Great service and friendly staff", "business_name": "Test Cafe"}
    response = client.post("/api/agent/review", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "response" in body
    assert body["sentiment"] in {"Positive", "Neutral", "Negative"}
    assert body["source"] in {"gemini", "deterministic"}


def test_invoice_endpoint_returns_structured_payload_for_binary_file():
    files = {"file": ("invoice.png", b"\x89PNG\r\n", "image/png")}
    response = client.post("/api/agent/invoice", files=files)
    assert response.status_code == 200
    body = response.json()
    assert "line_items" in body
    assert body["source"] in {"gemini", "deterministic"}


def test_sop_endpoint(monkeypatch):
    monkeypatch.setattr(main, "answer_sop_question", lambda file_bytes, question: {"answer": f"Echo: {question}"})
    files = {"file": ("doc.pdf", b"%PDF-1.4", "application/pdf")}
    data = {"question": "How do I reset password?"}
    response = client.post("/api/agent/sop", files=files, data=data)
    assert response.status_code == 200
    assert response.json()["answer"] == "Echo: How do I reset password?"


def test_sales_and_leads_endpoints(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    history = []
    steps = [
        "Hi",
        "My budget is $450000",
        "Downtown Manhattan",
        "Next week",
        "+1 555 555 1212",
    ]

    captured = False
    for message in steps:
        resp = client.post("/api/agent/sales", json={"history": history, "message": message})
        assert resp.status_code == 200
        payload = resp.json()
        history.extend([
            {"role": "user", "content": message},
            {"role": "assistant", "content": payload["response"]},
        ])
        if payload.get("lead_captured"):
            captured = True
            assert payload["data"]["lead_score"] >= 0
            assert payload["data"]["source"] in {"gemini", "deterministic"}
            break

    assert captured, "Expected lead to be captured by final step"

    leads_resp = client.get("/api/leads")
    assert leads_resp.status_code == 200
    leads = leads_resp.json()
    assert isinstance(leads, list)
    assert len(leads) >= 1

    with open("leads_db.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    assert isinstance(data, list)
