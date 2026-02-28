from agents import sales_agent


def test_qualify_lead_progression_and_completion_deterministic(monkeypatch):
    monkeypatch.setattr(sales_agent, "_llm_qualify_response", lambda *_: None)

    history = []
    msg = sales_agent.qualify_lead(history, "Hi")
    assert "budget" in msg.lower()

    history = [
        {"role": "user", "content": "My budget is $400000"},
        {"role": "assistant", "content": "ok"},
        {"role": "user", "content": "Downtown Manhattan"},
        {"role": "assistant", "content": "ok"},
        {"role": "user", "content": "next week"},
    ]
    msg = sales_agent.qualify_lead(history, "+1 555 555 1212")
    assert "qualified" in msg.lower()


def test_qualify_lead_uses_llm_when_available(monkeypatch):
    monkeypatch.setattr(sales_agent, "_llm_qualify_response", lambda *_: "What is your move-in date?")
    msg = sales_agent.qualify_lead([], "Hi")
    assert msg == "What is your move-in date?"


def test_score_lead_generates_hot_lead_deterministic(monkeypatch):
    monkeypatch.setattr(sales_agent, "_llm_score_lead", lambda *_: None)

    history = [
        {"role": "user", "content": "My budget is $450000"},
        {"role": "user", "content": "Looking in Downtown Manhattan"},
        {"role": "user", "content": "I need to move next week"},
        {"role": "user", "content": "+1 555 555 1212"},
    ]
    scored = sales_agent.score_lead(history)
    assert scored["lead_score"] >= 80
    assert scored["status"] == "Hot"
    assert scored["contact_number"] != "Unknown"
    assert scored["source"] == "deterministic"


def test_score_lead_gemini_path(monkeypatch):
    monkeypatch.setattr(
        sales_agent,
        "_llm_score_lead",
        lambda *_: {
            "budget": "$300,000",
            "location": "Austin",
            "timeline": "Next month",
            "contact_number": "+1 555 000 0000",
            "lead_score": 88,
            "status": "Hot",
            "summary": "High intent lead",
        },
    )

    scored = sales_agent.score_lead([{"role": "user", "content": "test"}])
    assert scored["source"] == "gemini"
    assert scored["lead_score"] == 88
    assert scored["status"] == "Hot"
