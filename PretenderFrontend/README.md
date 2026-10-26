# Pretender frontend

Angular CLI application for the Pretender procurement module. It runs independently from the Spring Boot API.

## Prerequisites

- Node.js compatible with Angular 22 (20.19+, 22.12+, or supported Node 24)
- npm 11+

## Install, build, and run

```sh
npm ci
npm run build
npm start
```

The development server runs at `http://localhost:4200`. API requests use relative `/api` paths through `proxy.conf.json`, whose default target is `http://127.0.0.1:8080`. Change that file's `target` to use another local backend. Do not put credentials in frontend environment files.

Run the frontend unit tests with `npm test -- --watch=false`.

## Pretender pages

The Pre-Tender Details page captures tender information, schedule dates, and document uploads. Dropdowns are managed under **Pretender → Masters**. Each master has an **Add** tab for saving values and a **View** tab for its saved records, backed by its own PostgreSQL table. Add future business features under `src/app/features/<feature-name>/`; put reusable and cross-cutting code in `src/app/common/`.

The parent-work picker calls the backend's local `GET /api/works/search?q=...` API. Development results are explicitly marked as mock data; this does not connect to WAMIS Core.
