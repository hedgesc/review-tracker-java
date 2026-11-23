# Review Tracker (Java)

Spring Boot + MySQL + React app for tracking review cadence on owned items.

## Stack

- **Backend:** Spring Boot 3.4, JPA, Flyway, springdoc OpenAPI
- **Database:** MySQL 8
- **Frontend:** Vite + React + TypeScript (served by nginx in Docker)

## Prerequisites

- Docker / Docker Compose

No local Java, Maven, or Node.js install is required when using Docker Compose.

## Run with Docker Compose

From the repo root:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| App (frontend) | http://localhost:5173 |
| API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MySQL | `localhost:3306` |

The frontend nginx container proxies `/api` to the backend, so the UI talks to the API on the same origin.

Stop everything:

```bash
docker compose down
```

## Optional: run services locally (without containers for app code)

If you prefer to develop outside Docker:

1. Start only MySQL: `docker compose up -d mysql`
2. Backend: Java 21+, Maven 3.9+ — `cd backend && mvn spring-boot:run`
3. Frontend: Node.js 20+ — `cd frontend && npm install && npm run dev`

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/items` | Create an item |
| `GET` | `/api/items` | List items (`filter=overdue` optional, `skip`, `take`) |
| `POST` | `/api/items/{id}/reviews` | Record a review (advances next due date) |
| `GET` | `/api/reviews` | Audit list (`itemId`, `from`, `to`, `skip`, `take`) |

## Database credentials (dev)

- Database: `ReviewTracker`
- User / password: `reviewtracker` / `reviewtracker`
- JDBC (host): `jdbc:mysql://localhost:3306/ReviewTracker`
- JDBC (compose network): `jdbc:mysql://mysql:3306/ReviewTracker`
