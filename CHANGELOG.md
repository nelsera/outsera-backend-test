# Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0] - 2026-03-05

### Added

- Endpoint `GET /producers/intervals` that returns the minimum and maximum interval between consecutive wins for producers.
- CSV dataset loader executed at application startup.
- In-memory SQLite database used for fast and deterministic execution.
- Integration tests covering:
  - successful responses (`200`)
  - deterministic results
  - schema validation
  - error scenarios (`503` when DB not initialized, `404` for unknown routes).

### Improved

- Structured logging using **Pino**.
- HTTP request logging including:
  - HTTP method
  - route
  - status code
  - response time
  - client IP
- Logs automatically disabled during test execution.

### Infrastructure

- Docker environment for running the API.
- Jest configured with **TypeScript support (ts-jest)**.
- Path alias support for cleaner imports (e.g. `#database`, `#repositories`, `#utils`).
