# Pretender backend

Spring Boot REST API with a PostgreSQL database, JPA entities, Spring Data repositories, and service-layer business logic.

## Prerequisites

- Java 21+
- Apache Maven 3.9+
- PostgreSQL 14+ running locally

## Database setup

The local database `pretender_db` is initialized with the seven dropdown master tables and the `pre_tender` table. For a new machine, create the database with `createdb -U postgres pretender_db`.

The ignored `application-local.properties` is configured for `localhost:5432/pretender_db` and the local `postgres` account. It is excluded from source control. Edit it locally, or set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables. The schema and starter dropdown values are initialized from `src/main/resources/schema.sql` at backend startup.

## Build and run

```sh
mvn clean package
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Master CRUD endpoints are under `/api/masters/{master-key}`; tender endpoints are under `/api/tenders`. Uploaded documents are saved in the ignored `uploads/` directory.

## Backend structure

- `entities/`: seven master entities and the tender entity, mapped to PostgreSQL tables
- `repositories/`: Spring Data JPA repositories for each master table and tenders
- `services/`: master CRUD, tender creation/listing, and file storage logic
- `forms/`: validated API request and response models
- `controllers/`: thin REST endpoint adapters
- `common/exceptions/`: shared REST exception mapping

Put tests under `src/test/java/com/pretender` using the matching package structure.

