"""Domain-specific exceptions for PDF processing, translated to HTTP errors at the router layer."""


class PDFProcessingError(Exception):
    """Raised when a PDF cannot be processed (corrupt file, encrypted, etc.)."""


class InvalidPageRangeError(Exception):
    """Raised when a requested page number/range is outside the document bounds."""
