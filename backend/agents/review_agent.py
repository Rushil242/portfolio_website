import re
from typing import Dict, Optional

from agents.llm_client import generate_json

POSITIVE_WORDS = {
    "great", "excellent", "amazing", "friendly", "best", "love", "perfect", "quick", "awesome", "delicious",
}
NEGATIVE_WORDS = {
    "bad", "terrible", "awful", "slow", "rude", "cold", "late", "worst", "never", "dirty", "disappointed",
}


def _sentiment(review_text: str) -> str:
    tokens = re.findall(r"[a-zA-Z']+", review_text.lower())
    pos = sum(1 for token in tokens if token in POSITIVE_WORDS)
    neg = sum(1 for token in tokens if token in NEGATIVE_WORDS)

    if neg > pos:
        return "Negative"
    if pos > neg:
        return "Positive"
    return "Neutral"


def _llm_review_response(review_text: str, business_name: str) -> Optional[Dict[str, str]]:
    prompt = f"""
You are a customer support response writer for {business_name}.
Return strict JSON with keys:
- sentiment: one of Positive, Negative, Neutral
- response: public reply text
Rules:
- If negative: empathetic, non-defensive, offer support via email support@{business_name.lower().replace(' ', '')}.com and sign with Customer Success Team.
- If positive: thank warmly, mention what they liked, invite them back.
- If neutral: thank and acknowledge feedback.
Customer review:
{review_text}
"""
    data = generate_json(prompt)
    if not data:
        return None

    sentiment = data.get("sentiment")
    response = data.get("response")
    if sentiment in {"Positive", "Negative", "Neutral"} and isinstance(response, str) and response.strip():
        return {"sentiment": sentiment, "response": response.strip()}
    return None


def generate_review_response(review_text: str, business_name: str = "Our Company") -> Dict[str, str]:
    llm_result = _llm_review_response(review_text, business_name)
    if llm_result:
        llm_result["source"] = "gemini"
        return llm_result

    sentiment = _sentiment(review_text)
    support_email = f"support@{business_name.lower().replace(' ', '')}.com"

    if sentiment == "Negative":
        response = (
            f"Thank you for sharing your feedback. We're truly sorry your recent experience with {business_name} "
            "did not meet expectations. We understand how frustrating that must have felt, and we want to make it right. "
            f"Please email us at {support_email} with your visit details so we can resolve this quickly.\n\n"
            "Customer Success Team"
        )
    elif sentiment == "Positive":
        response = (
            f"Thank you so much for the wonderful review! We're thrilled to hear you had a great experience with {business_name}. "
            "Your feedback means a lot to our team, and we can't wait to welcome you back again soon."
        )
    else:
        response = (
            f"Thank you for taking the time to share your feedback about {business_name}. "
            "We appreciate hearing from our customers and are always working to improve your experience."
        )

    return {"response": response, "sentiment": sentiment, "source": "deterministic"}
