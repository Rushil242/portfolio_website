from agents import review_agent


def test_negative_review_response_contains_resolution_path(monkeypatch):
    monkeypatch.setattr(review_agent, "_llm_review_response", lambda *_: None)
    result = review_agent.generate_review_response(
        "Service was rude and food was cold. Terrible experience.",
        "Luigi Pizza",
    )
    assert result["sentiment"] == "Negative"
    assert "support@luigipizza.com" in result["response"]
    assert "Customer Success Team" in result["response"]
    assert result["source"] == "deterministic"


def test_positive_review_response_is_appreciative(monkeypatch):
    monkeypatch.setattr(review_agent, "_llm_review_response", lambda *_: None)
    result = review_agent.generate_review_response(
        "Amazing and friendly team. Best food!",
        "Luigi Pizza",
    )
    assert result["sentiment"] == "Positive"
    assert "thank" in result["response"].lower()


def test_gemini_review_path(monkeypatch):
    monkeypatch.setattr(
        review_agent,
        "_llm_review_response",
        lambda *_: {"sentiment": "Neutral", "response": "Thanks for the feedback."},
    )
    result = review_agent.generate_review_response("Okay service", "Luigi Pizza")
    assert result["source"] == "gemini"
    assert result["sentiment"] == "Neutral"
