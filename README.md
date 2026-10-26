# Pretender full-stack application

The repository contains two independent applications: [PretenderFrontend](PretenderFrontend/README.md) is the Angular UI and [PretenderBackend](PretenderBackend/README.md) is the Spring Boot API. The frontend development server proxies `/api` calls to the backend at `http://localhost:8080`.

## Start locally

1. Create the PostgreSQL database and check the local settings in `PretenderBackend/application-local.properties` (ignored by Git).
2. Start the API from `PretenderBackend` with `mvn spring-boot:run`.
3. Install and start the UI from `PretenderFrontend` with `npm ci` and `npm start`.

## Structure

```text
Pretender/
├── PretenderFrontend/                 # Angular CLI application
│   └── src/app/
│       ├── common/                    # Shared UI and cross-cutting concerns
│       └── features/pretender/        # Tender form, list, and master pages
└── PretenderBackend/                  # Spring Boot + Maven + PostgreSQL
    └── src/main/java/com/pretender/
        ├── controllers/               # REST API endpoints
        ├── services/                  # Business logic
        ├── repositories/              # Persistence access
        ├── entities/                  # Domain/persistence models
        └── security/                  # Security concerns
```

Add frontend features under `PretenderFrontend/src/app/features/`; put reusable code in `app/common`. Add backend code under the matching `com.pretender` package and tests under `src/test/java/com/pretender`.
