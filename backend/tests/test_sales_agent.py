from agents.sales_agent import qualify_lead, score_lead


def test_qualify_lead_progression_and_completion():
    history = []
    msg = qualify_lead(history, "Hi")
    assert "budget" in msg.lower()

    history = [
        {"role": "user", "content": "My budget is $400000"},
        {"role": "assistant", "content": "ok"},
        {"role": "user", "content": "Downtown Manhattan"},
        {"role": "assistant", "content": "ok"},
        {"role": "user", "content": "next week"},
    ]
    msg = qualify_lead(history, "+1 555 555 1212")
    assert "qualified" in msg.lower()


def test_score_lead_generates_hot_lead():
    history = [
        {"role": "user", "content": "My budget is $450000"},
        {"role": "user", "content": "Looking in Downtown Manhattan"},
        {"role": "user", "content": "I need to move next week"},
        {"role": "user", "content": "+1 555 555 1212"},
    ]
    scored = score_lead(history)
    assert scored["lead_score"] >= 80
    assert scored["status"] == "Hot"
    assert scored["contact_number"] != "Unknown"
