# Producers Intervals API

REST API that calculates the **minimum and maximum interval between consecutive wins for producers** based on the Golden Raspberry Awards dataset.

The application loads the CSV dataset into an **in-memory SQLite database** and exposes an endpoint to query the calculated intervals.

---

# Tech Stack

- Node.js
- TypeScript
- Express
- SQLite (in-memory)
- Jest (integration tests)
- Pino (structured logging)
- Docker

---

# Running the Application

## With Docker (recommended)

```bash
docker compose up --build
```

The API will be available at:

http://localhost:3000

---

## Running locally

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

---

# API Endpoint

### Get producer intervals

GET /producers/intervals

Example response (default dataset):

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

---

# Tests

Run all tests:

```bash
npm test
```

The project includes **integration tests** that validate:

- API response structure
- deterministic results
- error handling
- database initialization

---

# Project Structure

```
src/
  app/
  controllers/
  services/
  repositories/
  database/
  utils/

test/
  integration/
```

The architecture separates:

- **Controllers** -> HTTP layer
- **Services** -> business logic
- **Repositories** -> data access
- **Database** -> SQLite initialization

---

# Logging

The application uses **Pino** for structured logging.

Logs include:

- HTTP method
- route
- status code
- response time
- client IP

Pretty logs are enabled in development and disabled during tests.

---

# Dataset

The application loads the provided **CSV dataset** at startup and stores it in an **in-memory SQLite database**.

This approach keeps the API fast and deterministic for testing purposes.

---

# Author

Nelson Silva
