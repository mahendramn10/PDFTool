# Changelog

All notable changes to this project are documented in this file.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] - 2026-07-08

### Added
- Initial production release of PDFTool.
- Backend: FastAPI app with clean-architecture layering (routers/services/models/schemas/
  middleware/database/utils/config).
- 18 fully implemented tools across Organize, Optimize, Edit, and Convert categories.
- MongoDB Atlas integration (via Motor) for job history, with graceful degradation if
  the database is unreachable -- core tools never depend on it being up.
- Sliding-window in-memory rate limiter, structured request logging, global exception
  handling that never leaks internal errors to clients.
- Automatic temp-file lifecycle: per-request isolated directories, background cleanup
  task, plus a janitor sweep for orphaned directories.
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS v4 app with a config-driven tool
  page system, dark/light theme, drag-and-drop uploads, and per-tool SEO (meta tags,
  Open Graph, Twitter Cards, JSON-LD).
- Full documentation set: README, ARCHITECTURE, API reference, deployment guide,
  development guide, contributing guide, roadmap.
- Deployment configuration for Vercel (frontend), Render (backend via Dockerfile), and
  MongoDB Atlas.

### Notes
- Word/Excel/PowerPoint conversions use headless LibreOffice, installed via the provided
  Dockerfile -- no paid conversion API is used anywhere in the stack.
