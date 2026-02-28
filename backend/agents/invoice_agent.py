import io
import re
from datetime import datetime
from typing import Any, Dict, List, Optional

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None


CURRENCY_MAP = {
    "$": "USD",
    "€": "EUR",
    "£": "GBP",
    "₹": "INR",
}


def _safe_float(value: str) -> Optional[float]:
    cleaned = value.replace(",", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return None


def _extract_text_from_pdf_bytes(file_data: bytes) -> str:
    if PdfReader is None:
        return ""

    try:
        reader = PdfReader(io.BytesIO(file_data))
        return "\n".join((page.extract_text() or "") for page in reader.pages)
    except Exception:
        return ""


def _extract_invoice_fields(text: str) -> Dict[str, Any]:
    invoice_number = None
    date = None
    vendor_name = None
    total_amount = None
    tax_amount = 0.0
    currency = "USD"

    inv_match = re.search(r"invoice\s*(?:number|no|#)?\s*[:#-]?\s*([A-Z0-9-]+)", text, re.IGNORECASE)
    if inv_match:
        invoice_number = inv_match.group(1)

    date_match = re.search(r"\b(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b", text)
    if date_match:
        raw_date = date_match.group(1)
        for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%m/%d/%Y", "%d/%m/%Y", "%m-%d-%Y", "%d-%m-%Y"):
            try:
                date = datetime.strptime(raw_date, fmt).strftime("%Y-%m-%d")
                break
            except ValueError:
                continue

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if lines:
        vendor_name = lines[0][:120]

    total_match = re.search(r"(?:total\s*(?:due|amount)?|amount\s*due)\s*[:$€£₹]*\s*([0-9][0-9,]*\.?[0-9]{0,2})", text, re.IGNORECASE)
    if total_match:
        total_amount = _safe_float(total_match.group(1))

    tax_match = re.search(r"(?:tax|vat|gst)\s*[:$€£₹]*\s*([0-9][0-9,]*\.?[0-9]{0,2})", text, re.IGNORECASE)
    if tax_match:
        parsed_tax = _safe_float(tax_match.group(1))
        if parsed_tax is not None:
            tax_amount = parsed_tax

    currency_match = re.search(r"(USD|EUR|GBP|INR|AUD|CAD)\b|[$€£₹]", text, re.IGNORECASE)
    if currency_match:
        symbol_or_code = currency_match.group(0)
        currency = CURRENCY_MAP.get(symbol_or_code, symbol_or_code.upper())

    line_items: List[Dict[str, Any]] = []
    item_pattern = re.compile(r"^([A-Za-z].*?)\s{2,}([0-9][0-9,]*\.?[0-9]{0,2})$")
    for line in lines:
        match = item_pattern.match(line)
        if match:
            amount = _safe_float(match.group(2))
            if amount is not None:
                line_items.append({"description": match.group(1).strip(), "amount": amount})

    return {
        "invoice_number": invoice_number,
        "date": date,
        "vendor_name": vendor_name,
        "total_amount": total_amount,
        "currency": currency,
        "tax_amount": tax_amount,
        "line_items": line_items,
    }


def process_invoice(file_data: bytes, mime_type: str):
    text = ""
    if mime_type == "application/pdf" or file_data[:4] == b"%PDF":
        text = _extract_text_from_pdf_bytes(file_data)

    if text:
        return _extract_invoice_fields(text)

    return {
        "invoice_number": None,
        "date": None,
        "vendor_name": None,
        "total_amount": None,
        "currency": "USD",
        "tax_amount": 0,
        "line_items": [],
        "warning": "Could not extract machine-readable text from file. Upload a text PDF for deterministic extraction.",
    }
