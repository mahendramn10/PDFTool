# Roadmap

## ✅ Shipped (v1.0)

- Clean-architecture FastAPI backend + React 19 frontend
- 18 fully working tools: Merge, Split, Compress, Rotate, Delete/Extract/Rearrange Pages,
  Watermark, Page Numbers, PDF↔JPG, PDF↔PNG, JPG/PNG→PDF, PDF↔Word, PDF↔Excel, Word/Excel/PPT→PDF
- SEO: per-page meta tags, Open Graph, Twitter Cards, JSON-LD, sitemap.xml, robots.txt
- Rate limiting, request logging, global error handling, automatic temp-file cleanup
- Deployment configs for Vercel (frontend) + Render (backend) + MongoDB Atlas

## 🔜 Next (v1.1)

- [ ] User accounts: register/login (JWT already scaffolded in `models/user.py`)
- [ ] Job history dashboard (persist `Job` records already modeled in `models/job.py`)
- [ ] Additional tools: Unlock PDF (remove password), Protect PDF (add password), Crop PDF,
      Add Images to PDF, PDF to Text, HTML to PDF
- [ ] OCR: searchable-PDF generation from scanned documents (Tesseract, free/open-source)
- [ ] Redis-backed rate limiting for multi-instance deployments

## 🔮 Later (v2.0)

- [ ] AI PDF tools: summarization, Q&A over documents, smart redaction (opt-in, clearly labeled)
- [ ] Public developer API with API-key auth and usage dashboards
- [ ] Premium subscription tier: larger file size limits, batch processing, priority queue
- [ ] Real-time collaborative PDF annotation
- [ ] Browser extension for one-click "send to PDFTool"
- [ ] Mobile apps (iOS/Android) wrapping the existing API

## Guiding principles

- **Free-first:** the core toolset stays free, ad-free, and watermark-free.
- **No paid dependencies:** every processing library is open-source; nothing in the pipeline
  requires a metered third-party API to function.
- **Privacy by default:** files are never retained longer than necessary to serve the response.
