from agents import sop_agent


def test_best_matching_chunks_returns_relevant_text():
    doc = (
        "Onboarding requires account setup and policy training. "
        "Escalation process requires approval from the manager. "
        "Incident response includes triage and mitigation steps."
    )
    chunks = sop_agent._best_matching_chunks(doc, "What is the escalation process?")
    assert chunks
    assert any("Escalation process" in c for c in chunks)


def test_answer_sop_question_no_matches(monkeypatch):
    monkeypatch.setattr(sop_agent, "extract_text_from_pdf", lambda _: "Alpha beta gamma")
    result = sop_agent.answer_sop_question(b"pdf", "What is payroll policy?")
    assert result["answer"] == "I cannot find that information in the provided document."


def test_answer_sop_question_with_deterministic_fallback(monkeypatch):
    monkeypatch.setattr(
        sop_agent,
        "extract_text_from_pdf",
        lambda _: "Reset password by opening Settings. For MFA issues, contact admin.",
    )
    monkeypatch.setattr(sop_agent, "_llm_answer", lambda *_: None)

    result = sop_agent.answer_sop_question(b"pdf", "How do I reset password?")
    assert "Based on the document" in result["answer"]
    assert result["citations"]
    assert result["source"] == "deterministic"


def test_answer_sop_question_with_gemini(monkeypatch):
    monkeypatch.setattr(
        sop_agent,
        "extract_text_from_pdf",
        lambda _: "Reset password by opening Settings. For MFA issues, contact admin.",
    )
    monkeypatch.setattr(sop_agent, "_llm_answer", lambda *_: "Go to Settings and use reset password.")

    result = sop_agent.answer_sop_question(b"pdf", "How do I reset password?")
    assert "Settings" in result["answer"]
    assert result["source"] == "gemini"
