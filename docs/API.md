# API Reference

Base URL: `https://api.pdftool.app/api/v1` (production) or `http://localhost:8000/api/v1` (local).

All endpoints accept `multipart/form-data` and return either a file stream (on success) or a JSON
error object of the shape:

```json
{ "success": false, "message": "Human-readable error message", "errors": null }
```

## Health

`GET /health` → `{ "status": "ok", "service": "PDFTool API", "version": "1.0.0", "database": "connected" }`

## PDF Tools (`/pdf/*`)

| Endpoint | Method | Form fields | Returns |
|---|---|---|---|
| `/pdf/merge` | POST | `files` (2+ PDFs) | `merged.pdf` |
| `/pdf/split` | POST | `file` (1 PDF) | `split_pages.zip` |
| `/pdf/compress` | POST | `file`, `quality` (`low`\|`recommended`\|`high`) | `compressed.pdf` |
| `/pdf/rotate` | POST | `file`, `angle` (90\|180\|270), `pages` (optional, e.g. `1,3,5-8`) | `rotated.pdf` |
| `/pdf/delete-pages` | POST | `file`, `pages` (e.g. `2,4,7-9`) | `edited.pdf` |
| `/pdf/extract-pages` | POST | `file`, `pages` (e.g. `1,3,5-8`) | `extracted.pdf` |
| `/pdf/rearrange-pages` | POST | `file`, `order` (JSON array, e.g. `[3,1,2]`) | `rearranged.pdf` |
| `/pdf/watermark` | POST | `file`, `text`, `opacity`, `font_size`, `rotation`, `position` | `watermarked.pdf` |
| `/pdf/page-numbers` | POST | `file`, `position`, `start_number`, `font_size` | `numbered.pdf` |

## Image Tools (`/image/*`)

| Endpoint | Method | Form fields | Returns |
|---|---|---|---|
| `/image/pdf-to-jpg` | POST | `file` (1 PDF) | `images.zip` |
| `/image/pdf-to-png` | POST | `file` (1 PDF) | `images.zip` |
| `/image/jpg-to-pdf` | POST | `files` (1+ JPGs) | `converted.pdf` |
| `/image/png-to-pdf` | POST | `files` (1+ PNGs) | `converted.pdf` |

## Office Conversion (`/office/*`)

| Endpoint | Method | Form fields | Returns |
|---|---|---|---|
| `/office/word-to-pdf` | POST | `file` (.doc/.docx) | `converted.pdf` |
| `/office/pdf-to-word` | POST | `file` (.pdf) | `converted.docx` |
| `/office/excel-to-pdf` | POST | `file` (.xls/.xlsx) | `converted.pdf` |
| `/office/pdf-to-excel` | POST | `file` (.pdf) | `converted.xlsx` |
| `/office/ppt-to-pdf` | POST | `file` (.ppt/.pptx) | `converted.pdf` |

## Error codes

| Status | Meaning |
|---|---|
| 400 | Malformed request (bad page spec, invalid JSON, etc.) |
| 413 | File exceeds the configured size limit (default 50MB) |
| 415 | Unsupported file type for this endpoint |
| 422 | File could not be processed (corrupted, encrypted, wrong content) |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

## Example (curl)

```bash
curl -X POST https://api.pdftool.app/api/v1/pdf/merge \
  -F "files=@report-part1.pdf" \
  -F "files=@report-part2.pdf" \
  -o merged.pdf
```

Interactive docs (Swagger UI) are available at `/api/docs` in non-production environments.
