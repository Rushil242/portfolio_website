from agents.review_agent import generate_review_response


def test_negative_review_response_contains_resolution_path():
    result = generate_review_response(
        "Service was rude and food was cold. Terrible experience.",
        "Luigi Pizza",
    )
    assert result["sentiment"] == "Negative"
    assert "support@luigipizza.com" in result["response"]
    assert "Customer Success Team" in result["response"]


def test_positive_review_response_is_appreciative():
    result = generate_review_response(
        "Amazing and friendly team. Best food!",
        "Luigi Pizza",
    )
    assert result["sentiment"] == "Positive"
    assert "thank" in result["response"].lower()
