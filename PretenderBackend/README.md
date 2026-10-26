# Pretender backend

Spring Boot REST API with a PostgreSQL database, JPA entities, Spring Data repositories, and service-layer business logic.

## Prerequisites

- Java 21+
- Apache Maven 3.9+
- PostgreSQL 14+ running locally

## Database setup

The local database `pretender_db` is initialized with the seven dropdown master tables and the `pre_tender` table. For a new machine, create the database with `createdb -U postgres pretender_db`.

The ignored `application-local.properties` is configured for `localhost:5432/pretender_db` and the local `postgres` account. It is excluded from source control. Edit it locally, or set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables. `src/main/resources/schema.sql` runs at startup and uses additive `IF NOT EXISTS` DDL plus stable source-row keys. It adds missing metadata columns, retains existing records, and inserts workbook rows only once; it does not overwrite rows when the application restarts.

The imported workbook sheets contain 224 nonblank rows: 18 contract forms, 4 bid-opener types, 4 tender types, 177 product categories, 3 tender categories, and 18 tenderer classes. Product categories retain their tender-category relationship. Repeated source rows are kept as distinct records. Existing databases may still contain the earlier name-only starter values; they are retained because the database cannot distinguish those values from values maintained by a user. Review and remove any obsolete entries from the relevant master View page if they are no longer needed.

Master API responses include the display name and the available source code, description, bid-opener value, tender-category relationship, and source-row key. The Tender Type dropdown remains the `tender-type` master; the separate Tender Type (Procurement) radio group remains independent.

## Build and run

```sh
mvn clean package
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Master CRUD endpoints are under `/api/masters/{master-key}`; tender endpoints are under `/api/tenders`. Uploaded documents are saved in the ignored `uploads/` directory.

### Parent-work lookup (development only)

The application exposes its own local lookup at `GET /api/works/search?q=<text>` and `GET /api/works/{id}`. This is an application API backed by `WorksService`; it is not a WAMIS Core endpoint. The default development provider returns four stable sample works marked `DEVELOPMENT MOCK — NOT WAMIS CORE`. Set `PRETENDER_WORKS_PROVIDER=mock` (the default) when running locally. Setting another provider value disables the mock and startup fails unless a provider bean is supplied. The `prod` profile never enables the mock and fails startup until an approved adapter is configured.

The pre-tender form can select one of those sample works. The backend rechecks its stable ID and saves the ID, number and description; arbitrary client-entered work details are rejected. No other tender fields are populated from a work because no approved mapping has been supplied. These mock selections are for UI and persistence development only and must not be treated as actual WAMIS works or submitted to GePNIC.

To replace the mock, the WAMIS Core owner must provide the approved base URL per environment, endpoint/path and HTTP method, authentication and credential provisioning method, search parameters and pagination behavior, response schema and stable identifier semantics, authorization/office scoping, TLS/certificate requirements, timeout/retry/rate-limit guidance, and error responses. The owner must also confirm which work attributes may be copied into this tender and their business rules. Implement these details in a `WamisCoreWorksService` adapter behind `WorksService`; keep the Angular contract (`id`, `workNumber`, `description`, `source`, `mock`) stable where possible.

The backend tender API supports `GET /api/tenders/{id}`, `PUT /api/tenders/{id}`, and multipart `POST /api/tenders/with-files` / `PUT /api/tenders/{id}/with-files`. The multipart endpoints stage uploads and delete newly staged files if tender validation or persistence fails. Existing file names are retained during edits unless replaced.

## Backend structure

- `entities/`: seven master entities and the tender entity, mapped to PostgreSQL tables
- `repositories/`: Spring Data JPA repositories for each master table and tenders
- `services/`: master CRUD, tender creation/listing, and file storage logic
- `forms/`: validated API request and response models
- `controllers/`: thin REST endpoint adapters
- `common/exceptions/`: shared REST exception mapping

Put tests under `src/test/java/com/pretender` using the matching package structure.

