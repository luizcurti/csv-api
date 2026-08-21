# picklist-api

![CI](https://github.com/luizcurti/picklist-api/workflows/CI/badge.svg)

REST API for CSV-backed product data management with complete CRUD operations, built with Clean Architecture principles.

## 📋 Prerequisites

- Node.js 20.19+ (see `.nvmrc`)
- npm
- Docker (optional, for containerized runs)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env

# Start development server (hot reload)
npm run dev
```

**API base URL**: `http://localhost:3005/api/csv`
**Interactive API docs (Swagger UI)**: `http://localhost:3005/docs`
**Health check**: `http://localhost:3005/health`
**Postman collection**: `data_csv.postman_collection.json`

### Run with Docker

```bash
docker compose up --build
```

This builds the production image, mounts `./csv` as a volume so data persists on the host, and exposes the API on `http://localhost:3005`.

## 🛠️ Available Scripts

### Development

```bash
npm run dev              # Start development server with hot reload
```

### Testing

```bash
npm test                 # Run unit + integration tests with coverage (100% enforced)
npm run test:unit        # Run only unit tests
npm run test:integration # Run only integration tests (real Express app + supertest)
npm run test:e2e         # Run e2e tests against a live server (see Testing below)
npm run test:watch       # Run unit + integration tests in watch mode
```

### Build & Production

```bash
npm run build            # Compile TypeScript to dist/ (tsc + tsc-alias)
npm start                # Start production server from dist/
npm run clean            # Remove build/coverage artifacts
```

### Code Quality

```bash
npm run eslint           # Lint with ESLint (flat config)
npm run eslint:fix       # Fix ESLint issues automatically
npm run format           # Format the codebase with Prettier
npm run format:check     # Check formatting without writing
```

### Automation

```bash
npm run setup            # Install dependencies + build
npm run ci                # Full pipeline: lint + format check + test + build
```

### Documentation

```bash
npm run docs:diagrams    # Regenerate docs/img/*.png from docs/mmd/*.mmd
```

## 📋 API Endpoints

### Base URL

```
http://localhost:3005/api/csv/
```

#### GET `/api/csv/`

- **Description**: List all products (paginated)
- **Query Parameters**:
  - `limit` (optional): Items per page (default: 100, max: 1000)
  - `offset` (optional): Items to skip (default: 0)
- **Response**:

```json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

- **Status**: 200 OK

#### POST `/api/csv/`

- **Description**: Create a new product
- **Body**: `{ "product_code": "string", "quantity": number, "pick_location": "string" }`
- **Status**: 201 Created / 400 Validation error / 409 Already exists

#### GET `/api/csv/:product_code`

- **Description**: Find a product by code
- **Status**: 200 OK / 404 Not Found

#### PUT `/api/csv/:product_code`

- **Description**: Update an existing product
- **Body**: `{ "quantity": number, "pick_location": "string" }`
- **Status**: 200 OK / 404 Not Found

#### DELETE `/api/csv/:product_code`

- **Description**: Delete a product by code
- **Status**: 200 OK / 404 Not Found

#### GET `/health`

- **Description**: Liveness check (`status`, `uptime`, `timestamp`)
- **Status**: 200 OK

Full request/response schemas are available interactively at `/docs` (Swagger UI).

## 🧪 Testing

Three independent layers, covering both happy and sad paths (validation errors, not found, conflicts, rate limiting, unknown routes):

- **Unit** (`src/tests/*.unit.spec.ts`): use cases, controllers, the repository, middlewares, config and utilities tested in isolation (mocked `fs`, in-memory repository, module-registry resets for env-dependent branches).
- **Integration** (`src/tests/*.integration.spec.ts`): boots the real Express app in-process and drives it with `supertest` against an isolated, disposable CSV file — full CRUD flow, validation, health check, Swagger UI, 404s.
- **E2E** (`src/tests/*.e2e.spec.ts`): black-box tests that make real HTTP requests over the network against an already-running server (typically the Docker container). Run separately:

  ```bash
  docker compose up -d --build
  npm run test:e2e
  docker compose down
  ```

  Point it at a different instance with `E2E_BASE_URL=http://localhost:3005 npm run test:e2e`. The suite restores the original `csv/data.csv` content in `afterAll`, regardless of test outcome.

- **Coverage**: `npm test` (unit + integration) enforces a **100% threshold** (statements, branches, functions, lines) via `jest.config.js` — the build fails if coverage regresses. Reports are written to `coverage/` (text, LCOV, HTML).

## 🏗️ Architecture

This project follows **Clean Architecture** principles. For a diagram-driven
walkthrough of the request lifecycle, the mutex-protected CSV writes, and
the Docker build, see **[docs/SYSTEM_FLOW.md](docs/SYSTEM_FLOW.md)**.

```
src/
├── config/                 # Centralized, validated environment configuration
│   └── env.ts
├── errors/                 # Custom error classes
│   └── appError.ts
├── modules/
│   └── data/
│       ├── repositories/   # Data access layer (CSV file, mutex-protected writes)
│       │   ├── dbDataRepository.ts
│       │   └── iDataRepository.ts
│       └── useCases/       # Business logic
│           ├── createData/
│           ├── deleteData/
│           ├── editData/
│           ├── listAllData/
│           └── listDataById/
├── shared/
│   ├── infra/
│   │   ├── app.ts          # Express app (middlewares, routes, docs, health)
│   │   ├── server.ts       # Entry point + graceful shutdown
│   │   └── http/
│   │       ├── docs/       # OpenAPI spec
│   │       ├── middlewares/
│   │       └── routes/
│   ├── utils/               # Logger, CSV sanitizer
│   └── validation/          # Yup schemas
└── tests/                   # Unit and integration tests
```

### Design patterns & practices

- ✅ Clean Architecture (controller → use case → repository)
- ✅ Repository pattern with dependency injection
- ✅ Centralized, validated configuration (`src/config/env.ts`)
- ✅ Mutex-protected CSV writes (no lost updates under concurrent requests)
- ✅ Structured JSON logging
- ✅ Graceful shutdown on `SIGTERM`/`SIGINT`

## 🔧 Configuration

### Environment variables

| Variable               | Default        | Description                             |
| ---------------------- | -------------- | --------------------------------------- |
| `PORT`                 | `3005`         | HTTP port                               |
| `NODE_ENV`             | `development`  | `development`, `production` or `test`   |
| `CSV_FILE_PATH`        | `csv/data.csv` | Path to the CSV data store              |
| `CORS_ORIGIN`          | `*`            | Allowed CORS origin(s), comma-separated |
| `RATE_LIMIT_WINDOW_MS` | `60000`        | Rate limit window (ms) for `/api/*`     |
| `RATE_LIMIT_MAX`       | `100`          | Max requests per window for `/api/*`    |

See `.env.example`.

### Security & hardening

- `helmet` for HTTP security headers
- `cors` with configurable origin
- `express-rate-limit` on `/api/*`
- Server-side error responses never leak stack traces in `NODE_ENV=production`
- CSV injection sanitization on writes (`csvSanitizer.ts`)

### Tooling

- **ESLint 9** flat config (`eslint.config.js`) with `typescript-eslint`
- **Prettier 3** for formatting
- **tsc** + **tsc-alias** for the production build (path aliases resolved at build time)
- **ts-node-dev** for local development

## 🐳 Docker

```bash
# Build and run with docker-compose (recommended)
docker compose up --build

# Or manually
docker build -t picklist-api .
docker run -p 3005:3005 -v "$(pwd)/csv:/app/csv" picklist-api
```

The image is a multi-stage build (compile with `tsc`, run on a slim `node:22-alpine` runtime as a non-root user) with a built-in `HEALTHCHECK` against `/health`.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run tests (`npm test`) and linting (`npm run eslint:fix`)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
