# PDFTool

**Fast, Secure & Free PDF Tools**

PDFTool is a production-ready, full-stack web platform for working with PDFs: merge, split, compress,
rotate, edit pages, watermark, and convert to/from Word, Excel, PowerPoint, and images -- all for free,
with no sign-up required.

Live tools included in this release:

| Category  | Tools |
|-----------|-------|
| Organize  | Merge PDF, Split PDF |
| Optimize  | Compress PDF |
| Edit      | Rotate PDF, Delete Pages, Extract Pages, Rearrange Pages, Watermark, Page Numbers |
| Convert   | PDF ↔ JPG, PDF ↔ PNG, PDF ↔ Word, PDF ↔ Excel, Word → PDF, Excel → PDF, PowerPoint → PDF |

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Framer Motion, Axios, Lucide
React, React Helmet Async.

**Backend:** FastAPI, Python 3.12, MongoDB Atlas (via Motor), JWT auth scaffolding.

**PDF processing:** PyMuPDF, pypdf, Pillow, pdf2docx, openpyxl, LibreOffice (headless, for
Word/Excel/PowerPoint conversions). All free and open-source -- no paid conversion APIs.

## Repository Structure

```
pdftool/
├── frontend/          React + TypeScript + Vite app
├── backend/           FastAPI application (clean architecture)
├── docs/              Architecture, API, deployment & development docs
├── deployment/         Vercel + Render deployment configs
└── .github/workflows/  CI pipeline
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a full breakdown of the clean-architecture layering.

## Quick Start

### Backend

```bash
cd backend
python3.12 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET_KEY
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `/api/docs`.

> Word/Excel/PowerPoint conversion requires LibreOffice installed locally (`sudo apt install libreoffice`
> on Ubuntu/Debian, `brew install libreoffice` on macOS). This is only needed for those specific tools --
> everything else works with zero extra system dependencies.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev
```

The app will be available at `http://localhost:5173`.

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Contributing](./docs/CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)
- [Changelog](./CHANGELOG.md)

## Security

- Uploaded files are validated by extension and streamed to disk with a hard size cap (50MB default).
- Filenames are sanitized to prevent path traversal.
- Every request gets an isolated temp working directory, deleted immediately after the response is
  sent (and swept by a background janitor for any that fail to clean up).
- A sliding-window rate limiter protects the API from abuse (swappable for Redis at scale).
- CORS is restricted to configured origins; all error responses are normalized so internal details
  never leak to the client.

## License

MIT -- see [LICENSE](./LICENSE).
