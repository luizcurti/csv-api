# CSV-API

![CI](https://github.com/luizcurti/csv-api/workflows/CI/badge.svg)

REST API for CSV data management with complete CRUD operations using Clean Architecture principles.

## 📋 Prerequisites

- Node.js 18+
- npm

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use interactive menu
npm run menu
```

**API Base URL**: `http://localhost:3005/api/csv`

**Postman Collection**: `data_csv.postman_collection.json`



## �️ Available Scripts

### Development
```bash
npm run dev              # Start development server with hot reload
npm run dev:menu         # Interactive development menu
```

### Testing
```bash
npm test                 # Run unit tests with coverage
npm run test:watch       # Run tests in watch mode  
npm run test:api         # Test all API endpoints
npm run test:collection  # Test Postman collection
```

### Build & Production
```bash
npm run build            # Compile TypeScript to dist/
npm start                # Start production server
npm run clean            # Clean build files
```

### Code Quality
```bash
npm run eslint           # Check code quality
npm run eslint:fix       # Fix ESLint issues automatically
```

### Automation

```bash
npm run menu             # Interactive development menu
npm run start:test       # Build + Start + Test + Stop
npm run ci               # Full CI pipeline (lint + test + build)
npm run setup            # Initial project setup
```

## 📋 API Endpoints

### Base URL
```
http://localhost:3005/api/csv/
```

### Routes

#### GET `/api/csv/`
- **Description**: List all products
- **Response**: Array of products
- **Status**: 200 OK

#### POST `/api/csv/`
- **Description**: Create new product
- **Body**:
```json
{
  "product_code": "string",
  "quantity": "string",
  "pick_location": "string"
}
```
- **Response**: Created product
- **Status**: 201 Created

#### GET `/api/csv/:product_code`
- **Description**: Find product by code
- **Response**: Product object
- **Status**: 200 OK / 404 Not Found

#### PUT `/api/csv/:product_code`
- **Description**: Update existing product
- **Body**:
```json
{
  "quantity": "string",
  "pick_location": "string"
}
```
- **Response**: Success message
- **Status**: 200 OK / 404 Not Found

#### DELETE `/api/csv/:product_code`
- **Description**: Delete product by code
- **Response**: Success message
- **Status**: 200 OK / 404 Not Found



## 🧪 Testing

### Unit Tests
- **Framework**: Jest with TypeScript
- **Coverage**: 100% code coverage (74 tests)
- **Location**: `src/tests/`
- **Command**: `npm test`

### API Testing
- **Tool**: Automated bash scripts with curl
- **Script**: `./scripts/test-api.sh`
- **Command**: `npm run test:api`

### Test Categories
- ✅ Use Cases (business logic)
- ✅ Controllers (HTTP handlers)  
- ✅ Repository (data access)
- ✅ Error handling
- ✅ Integration tests

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

### Project Structure
```
src/
├── errors/                 # Custom error classes
│   └── appError.ts
├── modules/
│   └── data/
│       ├── repositories/   # Data access layer
│       │   ├── dbDataRepository.ts
│       │   └── iDataRepository.ts
│       └── useCases/      # Business logic
│           ├── createData/
│           ├── deleteData/
│           ├── editData/
│           ├── listAllData/
│           └── listDataById/
├── shared/
│   └── infra/
│       ├── app.ts         # Express configuration
│       ├── server.ts      # Main server
│       └── http/
│           ├── middlewares/
│           └── routes/
└── tests/                 # Unit tests (100% coverage)
```

### Design Patterns
- ✅ Clean Architecture
- ✅ Repository Pattern
- ✅ Use Case Pattern
- ✅ Dependency Injection
- ✅ Error Handling Pattern

## 🔧 Configuration

### ESLint
- ✅ Airbnb + Prettier configuration
- ✅ TypeScript support
- ✅ Jest testing support
- ✅ Automatic fix available

### Jest
- ✅ TypeScript configuration
- ✅ Path mapping (@modules, @shared)
- ✅ 100% code coverage
- ✅ HTML, text, and LCOV reports

### Babel
- ✅ TypeScript compilation
- ✅ Path aliases support
- ✅ Static file copying

## 🚦 Development Workflow

### Daily Development
```bash
# Use interactive menu
npm run menu

# Or start dev server
npm run dev
npm run start:test
``````



### For CI/CD

```bash
npm run ci

``````

### For Initial Setup

To perform the initial project setup, run:

```bash
npm run setup

``````

## 📊 Usage Examples

### Complete API Testing

```bash
# 1. Compile the project
npm run build

# 2. Start server in background
npm start &

# 3. Execute API tests
npm run test:api

# 4. Stop the server
kill %1

``````


### Development with Hot Reload

To start the development server with hot reload, run:

```bash
npm run dev

``````

### Quality Verification

To run code quality checks and tests, use the following command:

```bash
npm run eslint:fix && npm test

``````

## 🎯 VS Code Configuration

For better VS Code integration, you can configure automatic tasks:

### `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "isBackground": true
    },
    {
      "label": "Test API",
      "type": "npm",
      "script": "test:api",
      "group": "test"
    },
    {
      "label": "Full CI",
      "type": "npm",
      "script": "ci",
      "group": "build"
    }
  ]
}

``````
### `.vscode/launch.json`

```json





### Base URL
```
http://localhost:3005/api/csv/
```

### Available Routes

#### GET /api/csv/
- **Description**: List all data from CSV
- **Response**: Array of products
- **Status**: 200 OK

#### POST /api/csv/
- **Description**: Create new product
- **Body**:
```json
{
  "product_code": "string",
  "quantity": "string", 
  "pick_location": "string"
}
```
- **Response**: Created product
- **Status**: 201 Created

#### GET /api/csv/:product_code
- **Description**: Find product by product code
- **Response**: Product object
- **Status**: 200 OK / 404 Not Found

#### PUT /api/csv/:product_code
- **Description**: Update existing product
- **Body**:
```json
{
  "quantity": "string",
  "pick_location": "string"
}
```
- **Response**: Success message
- **Status**: 200 OK / 404 Not Found

#### DELETE /api/csv/:product_code
- **Description**: Delete product by product code
- **Response**: Success message
- **Status**: 200 OK / 404 Not Found

## 🧪 Testing

### Unit Tests
- **Coverage**: 100% code coverage
- **Framework**: Jest with TypeScript
- **Test files**: All in `src/tests/` directory
- **Command**: `npm test`

### API Tests
- **Tool**: Automated curl scripts
- **File**: `./scripts/test-api.sh`
- **Command**: `npm run test:api`

### Test Categories
- ✅ Use Cases (business logic)
- ✅ Controllers (HTTP handlers)
- ✅ Repository (data access)
- ✅ Error handling
- ✅ Integration tests

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Development Server
```bash
npm run dev
```

### Environment Variables
- `PORT`: Server port (default: 3005)
- `ENV`: Environment (LOCAL, PROD)

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

### Layers
1. **Entities**: Core business objects
2. **Use Cases**: Business logic and rules
3. **Controllers**: HTTP request/response handling
4. **Repository**: Data access abstraction
5. **Infrastructure**: External concerns (HTTP, CSV files)

### Design Patterns
- ✅ Dependency Injection
- ✅ Repository Pattern
- ✅ Use Case Pattern
- ✅ Error Handling Pattern

## � Scripts Overview

### Interactive Menu (`npm run menu`)
1. 🏗️ Build project
2. 🚀 Start server
3. 🧪 Run unit tests
4. �🔍 Run ESLint
5. 🌐 Test API endpoints
6. 📋 Test Postman collection
7. 🚀 Start server + Test API
8. 🔧 Full development cycle
9. 📊 Generate test coverage
10. 🧹 Clean build directory
11. 🔄 CI Pipeline

### Automated Scripts
- `./scripts/test-api.sh` - Complete API testing
- `./scripts/test-collection.sh` - Postman collection testing
- `./scripts/dev-menu.sh` - Interactive development menu
- `./scripts/validate-workflows.sh` - GitHub Actions validation

## 🔍 Features

- ✅ **Complete CRUD Operations**
- ✅ **CSV File Management**
- ✅ **Data Validation (Yup)**
- ✅ **Error Handling**
- ✅ **100% Test Coverage**
- ✅ **ESLint + Prettier**
- ✅ **TypeScript Support**
- ✅ **Hot Reload Development**
- ✅ **Automated Testing Scripts**
- ✅ **GitHub Actions CI/CD**
- ✅ **Interactive Development Menu**
- ✅ **Clean Architecture**

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `PORT`: Server port (default: 3005)
- `ENV`: Environment (LOCAL, PROD)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Run tests (`npm test`)
4. Run linting (`npm run eslint:fix`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**💡 Pro Tip:** Use `npm run menu` for an interactive development experience with all available options!