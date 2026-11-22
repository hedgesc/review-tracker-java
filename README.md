# Review Tracker (Java)

Spring Boot + MySQL + React app for tracking review cadence on owned items.

## Stack

- **Backend:** Spring Boot 3.4, JPA, Flyway, springdoc OpenAPI
- **Database:** MySQL 8 in Docker (`ReviewTracker`)
- **Frontend:** Vite + React + TypeScript

## Prerequisites

- Java 21+
- Maven 3.9+
- Docker / Docker Compose
- Node.js 20+

## Run locally

### 1. Start MySQL

```bash
docker compose up -d
```

Waits until healthy:

```bash
docker compose ps
```

### 2. Start the API

```bash
cd backend
mvn spring-boot:run
```

- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (proxies `/api` to the backend)

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/items` | Create an item |
| `GET` | `/api/items/overdue` | List overdue items |
| `POST` | `/api/items/{id}/reviews` | Record a review (advances next due date) |
| `GET` | `/api/reviews` | Audit list (`itemId`, `from`, `to`, `skip`, `take`) |

## Database credentials (dev)

- Database: `ReviewTracker`
- User / password: `reviewtracker` / `reviewtracker`
- JDBC: `jdbc:mysql://localhost:3306/ReviewTracker`
