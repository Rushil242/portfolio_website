import re
from datetime import datetime
from typing import Any, Dict, List, Optional


def _extract_budget(text: str) -> Optional[str]:
    money_match = re.search(r"(?:\$|usd\s*)?([0-9][0-9,]*(?:\.[0-9]{1,2})?)", text, re.IGNORECASE)
    if not money_match:
        return None

    amount = money_match.group(1).replace(",", "")
    try:
        amount_float = float(amount)
    except ValueError:
        return None

    return f"${amount_float:,.0f}" if amount_float >= 1000 else f"${amount_float:.2f}"


def _extract_phone(text: str) -> Optional[str]:
    phone_match = re.search(r"(?:\+?\d[\d\s\-()]{7,}\d)", text)
    if not phone_match:
        return None
    return re.sub(r"\s+", " ", phone_match.group(0)).strip()


def _extract_timeline(text: str) -> Optional[str]:
    lowered = text.lower()

    if any(term in lowered for term in ["asap", "immediately", "urgent", "today"]):
        return "ASAP"
    if "next week" in lowered:
        return "Next week"
    if "this week" in lowered:
        return "This week"
    if "next month" in lowered:
        return "Next month"

    # very lightweight date extraction patterns
    date_match = re.search(r"\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\b", text)
    if date_match:
        return date_match.group(1)

    month_match = re.search(
        r"\b(january|february|march|april|may|june|july|august|september|october|november|december)\b",
        lowered,
    )
    if month_match:
        return month_match.group(1).title()

    return None


def _extract_location(text: str) -> Optional[str]:
    patterns = [
        r"(?:in|at|around|near)\s+([A-Za-z][A-Za-z\s,.-]{2,})",
        r"location\s*(?:is|:)?\s*([A-Za-z][A-Za-z\s,.-]{2,})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip(" .,")

    # If message looks like mostly words and contains no budget/phone, accept as possible location.
    cleaned = text.strip()
    if cleaned and not _extract_budget(cleaned) and not _extract_phone(cleaned):
        if len(cleaned.split()) <= 5 and re.search(r"[A-Za-z]", cleaned):
            return cleaned
    return None


def _extract_lead_data(history: List[Dict[str, str]]) -> Dict[str, Optional[str]]:
    budget = None
    location = None
    timeline = None
    phone = None

    for msg in history:
        if msg.get("role") != "user":
            continue
        content = msg.get("content", "")
        budget = budget or _extract_budget(content)
        location = location or _extract_location(content)
        timeline = timeline or _extract_timeline(content)
        phone = phone or _extract_phone(content)

    return {
        "budget": budget,
        "location": location,
        "timeline": timeline,
        "contact_number": phone,
    }


def _missing_fields(data: Dict[str, Optional[str]]) -> List[str]:
    missing = []
    if not data.get("budget"):
        missing.append("budget")
    if not data.get("location"):
        missing.append("location")
    if not data.get("timeline"):
        missing.append("move-in date")
    if not data.get("contact_number"):
        missing.append("contact number")
    return missing


def qualify_lead(history: List[Dict[str, str]], current_message: str) -> str:
    deduped_history = history.copy()
    if not deduped_history or deduped_history[-1].get("content") != current_message:
        deduped_history.append({"role": "user", "content": current_message})

    data = _extract_lead_data(deduped_history)
    missing = _missing_fields(data)

    if not missing:
        return "Thank you! I have qualified your lead."

    next_field = missing[0]
    follow_up_map = {
        "budget": "Great, what budget range are you considering?",
        "location": "Got it. Which location or neighborhood are you targeting?",
        "move-in date": "When are you planning to move in?",
        "contact number": "Thanks. Could you also share your best contact number?",
    }

    # Friendly first-response tone
    if len([m for m in deduped_history if m.get("role") == "user"]) <= 1:
        return "Hi! I can help with that. " + follow_up_map[next_field]

    return follow_up_map[next_field]


def _to_int_budget(budget_str: Optional[str]) -> int:
    if not budget_str:
        return 0
    digits = re.sub(r"[^0-9.]", "", budget_str)
    if not digits:
        return 0
    try:
        return int(float(digits))
    except ValueError:
        return 0


def score_lead(history: List[Dict[str, str]]) -> Dict[str, Any]:
    data = _extract_lead_data(history)

    score = 0
    budget_val = _to_int_budget(data.get("budget"))
    if budget_val >= 300000:
        score += 40
    elif budget_val >= 100000:
        score += 30
    elif budget_val > 0:
        score += 20

    if data.get("location"):
        score += 20

    timeline = (data.get("timeline") or "").lower()
    if timeline in {"asap", "this week", "next week"}:
        score += 25
    elif timeline:
        score += 15

    if data.get("contact_number"):
        score += 15

    score = min(score, 100)

    if score >= 80:
        status = "Hot"
    elif score >= 50:
        status = "Warm"
    else:
        status = "Cold"

    summary = (
        f"Lead interested in {data.get('location') or 'unspecified area'}"
        f" with budget {data.get('budget') or 'unknown'}"
        f" and timeline {data.get('timeline') or 'unknown'}."
    )

    return {
        "budget": data.get("budget") or "Unknown",
        "location": data.get("location") or "Unknown",
        "timeline": data.get("timeline") or "Unknown",
        "contact_number": data.get("contact_number") or "Unknown",
        "lead_score": score,
        "status": status,
        "summary": summary,
        "captured_at": datetime.utcnow().isoformat() + "Z",
    }
