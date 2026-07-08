# Development Guide

## Prerequisites

- Python 3.12+
- Node.js 20+
- (Optional, for Word/Excel/PowerPoint conversion) LibreOffice installed locally

## Backend

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

- Interactive API docs: http://localhost:8000/api/docs
- Every service function in `app/services/` is a plain function taking/returning `pathlib.Path`
  objects -- write unit tests against them directly without needing a running server.

### Adding a new PDF tool (backend)

1. Add the core logic to `app/services/pdf/<your_tool>.py` (or `services/office/` for
   office-format conversions). Raise `PDFProcessingError` for expected failure cases.
2. Add an endpoint to the relevant router in `app/routers/` following the existing pattern:
   create job dir → save upload(s) → call service → `FileResponse` with cleanup background task.
3. That's it -- no other backend file needs to change.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

- App runs at http://localhost:5173.
- `npm run build` type-checks (`tsc -b`) then builds a production bundle with Vite.

### Adding a new PDF tool (frontend)

1. Add one entry to `TOOLS` in `src/constants/tools.ts` -- this is the single source of truth
   for the tool's name, description, endpoint, accepted file types, and any configurable fields.
2. Create `src/pages/<ToolName>/index.tsx`:
   ```tsx
   import { ToolPage } from "@/pages/ToolPage";
   import { getToolBySlug } from "@/constants/tools";

   const tool = getToolBySlug("your-tool-slug")!;

   export function YourToolPage() {
     return <ToolPage tool={tool} />;
   }
   ```
3. Register the route in `src/router.tsx`.
4. Add the URL to `frontend/public/sitemap.xml`.

No changes to `ToolPage.tsx`, `FileDropzone`, or any shared component are needed -- the generic
tool page handles upload, dynamic option fields, processing state, and download automatically.

## Code style

- Backend: type hints everywhere, docstrings on every module/service explaining *why*, not just
  *what*. Business logic never imports FastAPI types.
- Frontend: function components + hooks only, strict TypeScript, Tailwind utility classes (no
  inline styles except computed values like progress-bar width).
