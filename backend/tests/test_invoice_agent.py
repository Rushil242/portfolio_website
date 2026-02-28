from agents import invoice_agent


def test_process_invoice_returns_warning_for_non_pdf_binary():
    result = invoice_agent.process_invoice(b"\x89PNG\r\n", "image/png")
    assert "warning" in result
    assert result["invoice_number"] is None
    assert result["line_items"] == []


def test_extract_invoice_fields_from_text():
    text = """\
ACME Supplies Inc
Invoice # INV-1001
Date: 2025-02-10
Widget A    120.00
Widget B    80.00
Tax: 20.00
Total Due: 220.00 USD
"""

    parsed = invoice_agent._extract_invoice_fields(text)

    assert parsed["invoice_number"] == "INV-1001"
    assert parsed["date"] == "2025-02-10"
    assert parsed["vendor_name"] == "ACME Supplies Inc"
    assert parsed["total_amount"] == 220.0
    assert parsed["tax_amount"] == 20.0
    assert parsed["currency"] == "USD"
    assert len(parsed["line_items"]) >= 2
