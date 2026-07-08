# Deployment Guide

## Overview

- **Frontend** → Vercel (static build)
- **Backend** → Render (Docker web service)
- **Database** → MongoDB Atlas (free M0 tier is sufficient to start)

## 1. MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com.
2. Create a database user and note the connection string.
3. Under Network Access, allow access from `0.0.0.0/0` (or Render's static IPs, if enabled).
4. Copy the connection string into `MONGO_URI` (see below).

## 2. Backend on Render

The backend ships with a `Dockerfile` that installs LibreOffice (required for Word/Excel/
PowerPoint conversions) alongside the Python dependencies.

1. Push this repository to GitHub.
2. In Render, create a new **Web Service**, pointing at the `backend/` directory, environment
   **Docker**.
3. Set environment variables (Render dashboard → Environment):

   ```
   APP_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   MONGO_URI=mongodb+srv://...
   MONGO_DB_NAME=pdftool
   JWT_SECRET_KEY=<generate a long random string>
   MAX_UPLOAD_SIZE_MB=50
   ```

4. Render will build the Docker image and deploy. Health check path: `/api/v1/health`.
5. Note the deployed URL, e.g. `https://pdftool-api.onrender.com`.

`deployment/render.yaml` is provided as an Infrastructure-as-Code alternative -- point Render's
"New from Blueprint" flow at this repo and it will read that file directly.

## 3. Frontend on Vercel

1. In Vercel, import this repository, set the **root directory** to `frontend/`.
2. Framework preset: Vite.
3. Set the environment variable:

   ```
   VITE_API_BASE_URL=https://pdftool-api.onrender.com/api/v1
   ```

4. Deploy. `deployment/vercel.json` is included for SPA rewrite rules (so client-side routes
   like `/merge-pdf` don't 404 on refresh) and security headers.

## 4. Post-deploy checklist

- [ ] Visit `/api/v1/health` on the backend URL and confirm `"database": "connected"`.
- [ ] Run each tool once end-to-end from the deployed frontend.
- [ ] Confirm `sitemap.xml` and `robots.txt` are reachable at the frontend root.
- [ ] Set up uptime monitoring against `/api/v1/health` (Render's free tier spins down after
      inactivity -- a periodic ping keeps cold-start latency low).

## Local development with Docker (optional)

```bash
cd backend
docker build -t pdftool-backend .
docker run -p 8000:8000 --env-file .env pdftool-backend
```
