# Contributing to PDFTool

Thanks for considering a contribution! A few guidelines to keep the codebase consistent.

## Workflow

1. Fork the repo and create a branch: `git checkout -b feature/your-tool-name`.
2. Make your changes, following the patterns in [DEVELOPMENT.md](./DEVELOPMENT.md).
3. Ensure the backend compiles cleanly: `python -m py_compile app/**/*.py` (or just run the
   server and exercise your new endpoint).
4. Ensure the frontend type-checks: `npm run build`.
5. Open a pull request with a clear description of what changed and why.

## Adding a new tool

New tools should follow the existing service → router → registry-entry → page-wrapper pattern
described in [DEVELOPMENT.md](./DEVELOPMENT.md#adding-a-new-pdf-tool-backend). Please:

- Keep service functions framework-agnostic (no FastAPI imports in `app/services/`).
- Raise `PDFProcessingError` with a user-facing message for expected failure cases (corrupt
  file, out-of-range page number, etc.) rather than letting a raw exception bubble up.
- Only use free, open-source processing libraries -- no paid/metered APIs in the core pipeline.
- Add the tool to `constants/tools.ts` with a clear `shortDescription`/`description` for SEO.

## Reporting bugs

Please include: the tool you were using, the file type/size involved (not the file itself unless
it's not sensitive), and any error message shown. Open an issue or use the [contact page](/contact).

## Code of conduct

Be respectful and constructive. We're building a tool meant to help people -- let's keep the
collaboration around it just as helpful.
