# Pretender frontend

Angular CLI application for the Pretender procurement module. It runs independently from the Spring Boot API.

## Prerequisites

- Node.js 20.19+ or 22.12+ (Node 24 is supported)
- npm 11+

## Install, build, and run

```sh
npm ci
npm start
npm run build
```

The development server runs at `http://localhost:4200`. It proxies `/api` requests to `http://127.0.0.1:8080` using `proxy.conf.json`; change that file's `target` to use another local backend. The API path is configured in `src/environments/`.

## Pretender pages

The Pre-Tender Details page captures tender information, schedule dates, and document uploads. Dropdowns are managed under **Pretender → Masters**. Each master has an **Add** tab for saving values and a **View** tab for its saved records, backed by its own PostgreSQL table. Add future business features under `src/app/features/<feature-name>/`; put reusable and cross-cutting code in `src/app/common/`.
