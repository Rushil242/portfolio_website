import io
import re
from collections import Counter
from typing import Dict, List

from agents.llm_client import generate_text

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None


STOP_WORDS = {
    "the", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with", "is", "are", "was", "were",
    "this", "that", "it", "as", "at", "by", "from", "be", "what", "how", "when", "where", "who", "why",
}


def extract_text_from_pdf(file_bytes: bytes) -> str:
    if PdfReader is None:
        return "Error reading PDF: pypdf is not installed"

    try:
        pdf_stream = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_stream)
        pages: List[str] = []
        for page in reader.pages:
            pages.append(page.extract_text() or "")
        return "\n".join(pages).strip()
    except Exception as exc:
        return f"Error reading PDF: {exc}"


def _tokenize(text: str) -> List[str]:
    return [w for w in re.findall(r"[a-zA-Z0-9']+", text.lower()) if w not in STOP_WORDS and len(w) > 2]


def _best_matching_chunks(document_text: str, question: str, limit: int = 3) -> List[str]:
    question_tokens = _tokenize(question)
    if not question_tokens:
        return []

    q_counts = Counter(question_tokens)
    chunks = [c.strip() for c in re.split(r"\n\s*\n|(?<=[.!?])\s+", document_text) if c.strip()]

    scored = []
    for chunk in chunks:
        chunk_tokens = Counter(_tokenize(chunk))
        overlap = sum(min(chunk_tokens[token], count) for token, count in q_counts.items())
        if overlap > 0:
            scored.append((overlap, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]


def _llm_answer(question: str, context_chunks: List[str]) -> str | None:
    if not context_chunks:
        return None

    context = "\n\n".join(context_chunks)
    prompt = f"""
You are an SOP assistant. Answer the user question using only the provided context.
If the answer is not present, say exactly: I cannot find that information in the provided document.
Keep it concise and practical.

Context:
{context}

Question: {question}
"""
    return generate_text(prompt)


def answer_sop_question(file_bytes: bytes, question: str) -> Dict[str, object]:
    pdf_text = extract_text_from_pdf(file_bytes)

    if pdf_text.startswith("Error reading PDF"):
        return {"error": pdf_text}

    if not pdf_text:
        return {"answer": "I cannot find that information in the provided document."}

    matches = _best_matching_chunks(pdf_text, question)
    if not matches:
        return {"answer": "I cannot find that information in the provided document."}

    llm_response = _llm_answer(question, matches)
    if llm_response:
        return {
            "answer": llm_response,
            "citations": matches,
            "source": "gemini",
        }

    answer = "\n\n".join(matches)
    return {
        "answer": f"Based on the document:\n\n{answer}",
        "citations": matches,
        "source": "deterministic",
    }
