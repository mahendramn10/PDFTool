"""Shared helper for parsing human page-range strings like '1,3,5-8' into 0-indexed lists."""
from fastapi import HTTPException, status


def parse_page_spec(spec: str, total_pages: int) -> list:
    """Parse '1,3,5-8' (1-indexed, inclusive) into a sorted, de-duplicated 0-indexed list."""
    pages = set()
    spec = spec.strip()
    if not spec:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Page specification cannot be empty.")

    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            bounds = part.split("-")
            if len(bounds) != 2:
                raise HTTPException(status_code=400, detail=f"Invalid page range: '{part}'")
            try:
                start, end = int(bounds[0]), int(bounds[1])
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid page range: '{part}'")
            if start < 1 or end > total_pages or start > end:
                raise HTTPException(status_code=400, detail=f"Page range '{part}' is out of bounds (document has {total_pages} pages).")
            pages.update(range(start - 1, end))
        else:
            try:
                page = int(part)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid page number: '{part}'")
            if page < 1 or page > total_pages:
                raise HTTPException(status_code=400, detail=f"Page {page} is out of bounds (document has {total_pages} pages).")
            pages.add(page - 1)

    return sorted(pages)
