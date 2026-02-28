import json
import os
from typing import Any, Dict, Optional

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    def load_dotenv(*args, **kwargs):
        return False

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover
    genai = None


load_dotenv()

MODEL_NAME = "gemini-3-flash-preview"


def _api_key() -> Optional[str]:
    return os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY_2")


def llm_available() -> bool:
    return genai is not None and bool(_api_key())


def _model(response_json: bool = False):
    if not llm_available():
        return None

    genai.configure(api_key=_api_key())
    if response_json:
        return genai.GenerativeModel(
            MODEL_NAME,
            generation_config={
                "temperature": 0.2,
                "response_mime_type": "application/json",
            },
        )

    return genai.GenerativeModel(
        MODEL_NAME,
        generation_config={"temperature": 0.2},
    )


def _strip_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


def generate_json(prompt: str, payload: Any = None) -> Optional[Dict[str, Any]]:
    model = _model(response_json=True)
    if model is None:
        return None

    parts = [prompt]
    if payload is not None:
        parts.append(payload)

    try:
        response = model.generate_content(parts)
        return json.loads(_strip_fences(response.text))
    except Exception:
        return None


def generate_text(prompt: str) -> Optional[str]:
    model = _model(response_json=False)
    if model is None:
        return None

    try:
        response = model.generate_content(prompt)
        text = (response.text or "").strip()
        return text or None
    except Exception:
        return None
