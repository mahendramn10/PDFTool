# Architecture

PDFTool follows clean architecture on both the frontend and backend, keeping business logic
independent of frameworks and I/O so it stays testable and easy to extend toward 100+ tools.

## Backend (`backend/app/`)

```
config/       Settings (env-driven) + static constants          -- configuration layer
models/       Pydantic domain entities (Job, User)               -- domain layer
schemas/      API request/response DTOs                          -- interface layer
services/     Pure business logic, one module per concern:
  pdf/          merge, split, compress, rotate, pages, watermark, page_numbers, image_convert
  office/       office_convert (LibreOffice + pdf2docx wrappers)
routers/      FastAPI route handlers -- HTTP concerns only, delegate to services -- presentation layer
database/     MongoDB connection lifecycle (Motor)                -- data layer
middleware/   Rate limiting, logging, global error handling       -- cross-cutting
utils/        File validation/sanitization, page-range parsing, response helpers
main.py       Composition root: wires middleware, routers, lifespan events
```

**Why this split matters:** `services/pdf/merge.py` has zero knowledge of FastAPI, HTTP, or
file uploads -- it takes `Path` objects in, returns a `Path` out. That means:
- It's unit-testable without spinning up a server.
- The same function could power a CLI tool, a batch job, or a different API version.
- Adding tool #19 means adding one service file + one router function + one registry entry
  on the frontend -- never touching existing tools.

**Request lifecycle** (every tool endpoint follows this shape):
1. `new_job_dir()` creates an isolated UUID-named temp directory.
2. `save_upload()` validates extension + streams the file to disk with a size cap.
3. The service function does the actual PDF work, writing to an output path in the same dir.
4. `FileResponse` streams the result back, with a `BackgroundTask` that deletes the job
   directory once the response finishes sending.
5. A background janitor task (`purge_stale_temp_files`) sweeps any directories that survive
   longer than `FILE_TTL_SECONDS`, as a safety net against crashed requests.

## Frontend (`frontend/src/`)

```
constants/tools.ts     Single source of truth: every tool's metadata, endpoint, and form fields
types/                 Shared TypeScript interfaces (ToolDefinition, UploadedFile, etc.)
api/client.ts          Configured Axios instance + error normalization
services/pdfService.ts Typed wrapper: FormData building, blob download, error parsing
hooks/                 useFileUpload (drag/drop + validation), usePDFTool (process lifecycle)
components/
  common/                 SEO, Loader, ProgressBar, ErrorBoundary -- generic, tool-agnostic
  ui/                     Button, Card, Badge -- design system primitives
  layout/                 Header, Footer
  pdf/                    FileDropzone, ToolCard, ToolOptionsForm -- PDF-domain specific
pages/
  ToolPage.tsx            Generic tool page: upload -> configure -> process -> download
  <ToolName>/index.tsx    3-line wrapper: looks up its ToolDefinition, renders <ToolPage>
  Home/, Blog/, About/... Static/marketing pages
layouts/MainLayout.tsx   Header + Footer shell
context/ThemeContext.tsx Light/dark mode
```

**Why config-driven tool pages:** Every PDF tool follows the identical UX shape (upload file(s) →
optionally configure a few fields → submit → download). Rather than hand-writing 18 near-identical
page components, `ToolPage.tsx` is the single implementation, and each `pages/<Tool>/index.tsx` is
a thin wrapper that supplies its `ToolDefinition` from the registry. This keeps routing and SEO
per-page (each tool gets its own URL, title, and JSON-LD) while eliminating duplicated logic --
and means adding tool #19 is a five-minute change: one entry in `constants/tools.ts`, one wrapper
file, one router entry.

## Data flow diagram

```
Browser                          FastAPI                         Filesystem
   │  POST /api/v1/pdf/merge         │                                │
   │ ───────────────────────────────>│  new_job_dir()                 │
   │                                  │ ──────────────────────────────>│ /tmp/pdftool/<uuid>/
   │                                  │  save_upload() x N              │
   │                                  │ ──────────────────────────────>│ writes input files
   │                                  │  merge_service.merge_pdfs()     │
   │                                  │ ──────────────────────────────>│ writes merged.pdf
   │  <── FileResponse (streamed) ────│                                │
   │                                  │  BackgroundTask: cleanup_paths  │
   │                                  │ ──────────────────────────────>│ rm -rf <uuid>/
```

## Scaling toward the roadmap

- **100+ tools:** the service/router/registry pattern above scales linearly -- no architectural
  change needed, just more files following the existing shape.
- **OCR:** add `services/pdf/ocr.py` wrapping `pytesseract` (free, open-source) + a new router.
- **User accounts / dashboard:** `models/user.py` and JWT settings already exist; add
  `routers/auth.py` (register/login/refresh) and a `middleware/auth.py` dependency for
  protected routes.
- **API for developers:** the existing `/api/v1/*` routes are already a clean public API surface;
  add API-key auth and per-key rate limits as a variant of `RateLimitMiddleware`.
- **Premium subscription:** `models/user.py` already has a `plan` field; gate higher file-size
  limits / priority queueing behind it.
