# CSV-API# CSV-API



REST API for CSV data management with complete CRUD operations.API REST para gerenciamento de dados CSV com operações CRUD completas.



## 📋 Prerequisites## 📋 Pré-requisitos



Before booting the system, run "npm install"Before booting the system, run "npm install"



The route for testing the api is: http://localhost:3005/api/csv/The route for testing the api is: http://localhost:3005/api/csv/



The file "Data CSV.postman_collection" contains the routes for testing in PostmanThe file "Data CSV.postman_collection" contains the routes for testing in Postman



## 🚀 Quick Start## 🚀 Quick Start



```bash```bash

# Initial setup# Setup inicial

npm run setupnpm run setup



# Development# Desenvolvimento

npm run devnpm run dev



# Production# Produção

npm run build && npm startnpm run build && npm start



# Automated tests# Testes automatizados

npm run start:testnpm run start:test

``````



## 🛠️ Available Scripts## � Scripts Disponíveis



### NPM Scripts### Scripts NPM



```bash```bash

# Development# Desenvolvimento

npm run dev              # Start server in development modenpm run dev              # Inicia servidor em modo desenvolvimento

npm run dev:menu         # Interactive development menunpm run dev:menu         # Menu interativo de desenvolvimento



# Build and Deploy# Build e Deploy

npm run build            # Compile TypeScript projectnpm run build            # Compila o projeto TypeScript

npm run start            # Start server in productionnpm run start            # Inicia servidor em produção

npm run clean            # Clean build filesnpm run clean            # Limpa arquivos de build



# Tests# Testes

npm test                 # Run unit tests with coveragenpm test                 # Executa testes unitários com cobertura

npm run test:watch       # Run tests in watch modenpm run test:watch       # Executa testes em modo watch

npm run test:unit        # Run unit tests onlynpm run test:unit        # Executa apenas testes unitários

npm run test:api         # Test API endpoints with curlnpm run test:api         # Testa endpoints da API com curl



# Code Quality# Qualidade do Código

npm run eslint           # Check code with ESLintnpm run eslint           # Verifica código com ESLint

npm run eslint:fix       # Automatically fix ESLint issuesnpm run eslint:fix       # Corrige automaticamente problemas do ESLint



# Complete Automation# Automação Completa

npm run start:test       # Build + Start + Test API + Stopnpm run start:test       # Build + Start + Test API + Stop

npm run ci               # CI pipeline (lint + test + build)npm run ci               # Pipeline de CI (lint + test + build)

npm run setup            # Initial project setupnpm run setup            # Setup inicial do projeto

``````



### Bash Scripts### Scripts Bash



#### 🌐 Test API (`./scripts/test-api.sh`)#### 🌐 Test API (`./scripts/test-api.sh`)



Automated script that tests all API endpoints:Script automatizado que testa todos os endpoints da API:



```bash```bash

./scripts/test-api.sh./scripts/test-api.sh

``````



**What the script tests:****O que o script testa:**

- ✅ GET /api/csv/ - List all data- ✅ GET /api/csv/ - Lista todos os dados

- ✅ POST /api/csv/ - Create new product- ✅ POST /api/csv/ - Cria novo produto

- ✅ GET /api/csv/:id - Find product by ID- ✅ GET /api/csv/:id - Busca produto por ID

- ✅ PUT /api/csv/:id - Edit product- ✅ PUT /api/csv/:id - Edita produto

- ✅ DELETE /api/csv/:id - Remove product- ✅ DELETE /api/csv/:id - Remove produto

- ✅ Error validation (duplicate product, not found)- ✅ Validação de erros (produto duplicado, não encontrado)



#### 🛠️ Development Menu (`./scripts/dev-menu.sh`)#### 🛠️ Menu de Desenvolvimento (`./scripts/dev-menu.sh`)



Interactive menu for all development operations:Menu interativo para todas as operações de desenvolvimento:



```bash```bash

./scripts/dev-menu.sh./scripts/dev-menu.sh

``````



**Available options:****Opções disponíveis:**

1. 🏗️ Build project1. 🏗️ Build project

2. 🚀 Start server2. 🚀 Start server

3. 🧪 Run unit tests3. 🧪 Run unit tests

4. 🔍 Run ESLint4. 🔍 Run ESLint

5. 🌐 Test API endpoints5. 🌐 Test API endpoints

6. 🚀 Start server + Test API6. 🚀 Start server + Test API

7. 🔧 Full development cycle7. 🔧 Full development cycle

8. 📊 Generate test coverage8. 📊 Generate test coverage

9. 🧹 Clean build directory9. 🧹 Clean build directory



## 🔧 Automated Configurations## 🔧 Configurações Automatizadas



### ESLint### ESLint

- ✅ Configured with Airbnb + Prettier- ✅ Configurado com Airbnb + Prettier

- ✅ Ignores `dist/` and `node_modules/` folders- ✅ Ignora pasta `dist/` e `node_modules/`

- ✅ Jest support- ✅ Suporte ao Jest

- ✅ Automatic fix available- ✅ Fix automático disponível



### Jest### Jest

- ✅ Configured for TypeScript- ✅ Configurado para TypeScript

- ✅ Path mapping support (@modules, @shared, etc.)- ✅ Suporte a path mapping (@modules, @shared, etc.)

- ✅ Automatic code coverage- ✅ Cobertura de código automática

- ✅ Reports in HTML, text, and LCOV- ✅ Relatórios em HTML, texto e LCOV



### Build### Build

- ✅ Babel configured for TypeScript- ✅ Babel configurado para TypeScript

- ✅ Copies static files (CSV, etc.)- ✅ Copia arquivos estáticos (CSV, etc.)

- ✅ Source maps for debugging- ✅ Source maps para debugging



## 🚦 Recommended Development Workflow## 🚦 Fluxo de Desenvolvimento Recomendado



### For daily development:### Para desenvolvimento diário:

```bash```bash

npm run dev:menunpm run dev:menu

``````



### To quickly test the API:### Para testar rapidamente a API:

```bash```bash

npm run start:testnpm run start:test

``````



### For CI/CD:### Para CI/CD:

```bash```bash

npm run cinpm run ci

``````



### For initial setup:### Para setup inicial:

```bash```bash

npm run setupnpm run setup

``````



## 📊 Usage Examples## 📊 Exemplos de Uso



### Complete API testing### Teste completo da API

```bash```bash

# 1. Compile the project# 1. Compile o projeto

npm run buildnpm run build



# 2. Start server in background# 2. Inicie o servidor em background

npm start &npm start &



# 3. Execute API tests# 3. Execute os testes da API

npm run test:apinpm run test:api



# 4. Stop the server# 4. Pare o servidor

kill %1kill %1

``````



### Development with hot reload### Desenvolvimento com hot reload

```bash```bash

npm run devnpm run dev

``````



### Quality verification### Verificação de qualidade

```bash```bash

npm run eslint:fix && npm testnpm run eslint:fix && npm test

``````



## 🎯 VS Code Configuration## 🎯 Configuração do VS Code



For better VS Code integration, you can configure automatic tasks:Para melhor integração com o VS Code, você pode configurar tasks automáticas:



### `.vscode/tasks.json`### `.vscode/tasks.json`

```json```json

{{

  "version": "2.0.0",  "version": "2.0.0",

  "tasks": [  "tasks": [

    {    {

      "label": "Start Dev Server",      "label": "Start Dev Server",

      "type": "npm",      "type": "npm",

      "script": "dev",      "script": "dev",

      "group": "build",      "group": "build",

      "isBackground": true      "isBackground": true

    },    },

    {    {

      "label": "Test API",      "label": "Test API",

      "type": "npm",       "type": "npm", 

      "script": "test:api",      "script": "test:api",

      "group": "test"      "group": "test"

    },    },

    {    {

      "label": "Full CI",      "label": "Full CI",

      "type": "npm",      "type": "npm",

      "script": "ci",       "script": "ci", 

      "group": "build"      "group": "build"

    }    }

  ]  ]

}}

``````



### `.vscode/launch.json`### `.vscode/launch.json`

```json```json

{{

  "version": "0.2.0",  "version": "0.2.0",

  "configurations": [  "configurations": [

    {    {

      "name": "Debug API",      "name": "Debug API",

      "type": "node",      "type": "node",

      "request": "launch",      "request": "launch",

      "program": "${workspaceFolder}/src/shared/infra/server.ts",      "program": "${workspaceFolder}/src/shared/infra/server.ts",

      "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],      "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],

      "env": {      "env": {

        "ENV": "LOCAL"        "ENV": "LOCAL"

      }      }

    }    }

  ]  ]

}}

``````



## 🔄 Continuous Integration## 🔄 Integração Contínua



The project is configured for CI/CD with the script:O projeto está configurado para CI/CD com o script:



```bash```bash

npm run cinpm run ci

``````



This command executes:Este comando executa:

1. ESLint (code verification)1. ESLint (verificação de código)

2. Unit tests (with coverage)2. Testes unitários (com cobertura)

3. Project build3. Build do projeto



## 📈 Metrics and Reports## 📈 Métricas e Relatórios



### Test Coverage### Cobertura de Testes

```bash```bash

npm testnpm test

# Generates report at: coverage/lcov-report/index.html# Gera relatório em: coverage/lcov-report/index.html

``````



### Code Analysis### Análise de Código

```bash```bash

npm run eslintnpm run eslint

# Shows quality issues# Mostra problemas de qualidade

``````



## 📚 Project Structure## 📚 Estrutura do Projeto



``````

src/src/

├── errors/              # Custom error classes├── errors/              # Classes de erro customizadas

├── modules/├── modules/

│   └── data/│   └── data/

│       ├── repositories/    # Data access layer│       ├── repositories/    # Camada de acesso a dados

│       └── useCases/       # Business rules│       └── useCases/       # Regras de negócio

│           ├── createData/│           ├── createData/

│           ├── deleteData/│           ├── deleteData/

│           ├── editData/│           ├── editData/

│           ├── listAllData/│           ├── listAllData/

│           └── listDataById/│           └── listDataById/

├── shared/├── shared/

│   └── infra/│   └── infra/

│       ├── app.ts          # Express configuration│       ├── app.ts          # Configuração do Express

│       ├── server.ts       # Main server│       ├── server.ts       # Servidor principal

│       └── http/│       └── http/

│           ├── middlewares/ # HTTP middlewares│           ├── middlewares/ # Middlewares HTTP

│           └── routes/      # Route definitions│           └── routes/      # Definição de rotas

└── tests/                  # Unit tests└── tests/                  # Testes unitários

``````



## 📋 API Endpoints---



### Base URL**💡 Dica:** Use `npm run dev:menu` para acessar todas as funcionalidades através de um menu interativo!
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

## 🔍 Features

- ✅ **Complete CRUD Operations**
- ✅ **CSV File Management**
- ✅ **Data Validation**
- ✅ **Error Handling**
- ✅ **Unit Testing (100% coverage)**
- ✅ **ESLint + Prettier**
- ✅ **TypeScript Support**
- ✅ **Hot Reload Development**
- ✅ **Automated Testing Scripts**
- ✅ **CI/CD Pipeline**

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**💡 Tip:** Use `npm run dev:menu` to access all features through an interactive menu!