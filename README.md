# Fastify Prisma Better Auth Boilerplate

A complete boilerplate to quickly start a backend project with **Fastify**, **Prisma**, **Better Auth**, and an advanced RBAC/ABAC authorization system.

> 🇫🇷 [Version française disponible ici](./README.fr.md)

## 📋 Table of Contents

- [Overview](#-overview)
- [Implemented Features](#-implemented-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Available Commands](#-available-commands)
- [ESLint, Prettier & Husky](#-eslint-prettier--husky)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)

## 🎯 Overview

This boilerplate provides a solid foundation for developing modern REST APIs with:

- **TypeScript**: Complete type-safety
- **Fastify**: Ultra-fast web framework
- **Prisma**: Modern ORM with migrations and type-safety
- **Better Auth**: Complete authentication (email/password, OAuth, sessions)
- **RBAC/ABAC**: Authorization system with roles, permissions, and policies
- **Multi-tenancy**: Organization support with data isolation
- **Monitoring**: Health check and version endpoints
- **Maintenance Mode**: Dynamically activatable maintenance mode
- **Advanced Logging**: Correlation ID for request tracing
- **Code Quality**: Pre-configured ESLint, Prettier, Husky, and lint-staged

## ✨ Implemented Features

### 1. 🔐 Authentication (Better Auth)

Complete authentication system based on [Better Auth](https://www.better-auth.com/):

- **Sign up/Sign in**: Email + password with secure hashing
- **Email verification**: Verification token system
- **Sessions**: User session management with tokens
- **Password reset**: Password reset flow
- **OAuth**: Support for external providers (configurable)
- **Linked accounts**: Multiple authentication methods per user

**Available endpoints**:

- `POST /api/auth/sign-up/email` - Create an account
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/send-verification-email` - Send verification email
- `GET /api/auth/list-accounts` - List authentication accounts associated with the user
- `POST /api/auth/update-user` - Update user data
- `POST /auth/verify-email` - Verify email
- `POST /api/auth/request-password-reset` - Reset password
- `GET /api/auth/ok` - Check authentication status

### 2. 🔒 Authorization (RBAC/ABAC)

TBD

#### **RBAC (Role-Based Access Control)**

- **Roles**: Custom role definition per organization or global
- **Permissions**: Granular permissions (e.g., `invoice.create`, `order.update`)
- **Role inheritance**: Roles can inherit from other roles
- **Multi-tenancy**: Organization-scoped roles

#### **ABAC (Attribute-Based Access Control)**

- **Policies**: Dynamic access rules based on JSONLogic
- **Context**: Permission evaluation with context (userId, organizationId, resource, etc.)
- **Evaluation**: `userCan()` and `assertUserCan()` functions to check permissions

**Data schema**:

```
User → RoleMembership → Role → RolePermission → Permission
                                              ↘ Policy (optional)
```

**Usage (Still in development)**:

```typescript
import { userCan, assertUserCan } from './modules/authz';

// Check if the user can perform an action
const canCreate = await userCan(userId, 'invoice.create', { organizationId: 'org123' });

// Throw an error if the user cannot
await assertUserCan(userId, 'invoice.create', { organizationId: 'org123' });
```

### 3. 🏢 Multi-tenancy (Organizations)

Complete support for multi-tenant applications:

- **Organizations**: Isolated groups of users
- **Memberships**: Relationship between users and organizations
- **Scoped roles**: Different roles per organization
- **Data isolation**: Data model prepared for isolation

### 4. 📊 Monitoring

Monitoring endpoints for supervision and health checks:

**Endpoints**:

- `GET /monitoring/health` - Application and database status
- `GET /monitoring/version` - Application version and uptime

**Response example**:

```json
{
    "status": "OK",
    "details": {
        "database": "OK"
    }
}
```

### 5. 🔧 Maintenance Mode

Plugin to activate/deactivate maintenance mode:

- **Ignored routes**: Maintenance and monitoring routes are not blocked
- **Dynamic activation**: Can be enabled/disabled without restart
- **Customizable message**: 503 error with maintenance message

**Endpoints**:

- `POST /maintenance` - Enable/disable maintenance mode
- `GET /maintenance` - Check maintenance mode status

**Usage**:

```typescript
// Enable maintenance mode
app.maintenance.enabled = true;

// Disable maintenance mode
app.maintenance.enabled = false;
```

### 6. 📝 Logging & Correlation

Advanced logging system with traceability:

- **Pino logger**: High-performance logger
- **Correlation ID**: Unique ID per request to trace logs
- **AsyncLocalStorage context**: Automatic propagation of correlation ID, extensible for other context variables
- **Structured logs**: JSON format for easy analysis

**How it works**:

- Each request receives an `x-correlation-id` (or generates one)
- The correlation ID is added to all request logs
- Allows tracing a request through all logs

### 7. 🗄️ Database (Prisma)

Prisma ORM with PostgreSQL multi-schema:

- **3 schemas**:
    - `core`: Users, sessions, accounts, verifications
    - `authz`: Organizations, roles, permissions, policies
    - `audit`: Access and audit logs
- **Migrations**: Automatic migration system
- **Type-safety**: Automatically generated TypeScript models
- **Relations**: Complex relationships between models
- **Seeding**: TBD

### 8. 🌍 CORS & Security

Pre-configured security plugins:

- **CORS**: CORS configuration to allow cross-origin requests
- **Helmet**: HTTP security headers (CSP, HSTS, etc.)

### 9. ⚙️ Typed Configuration

Configuration system with Zod validation:

- **Environment variables**: Strict validation at startup
- **Type-safety**: Fully typed configuration
- **Clear errors**: Detailed error messages if config is invalid

**Required variables**:

```env
NODE_ENV=dev|prod
PORT=3000
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

### 10. 🎯 Centralized Error Handling

Global and consistent error handler:

- **Custom errors**: Typed error classes (`CustomError`, `DatabaseError`, `MaintenanceError`)
- **Error codes**: Standardized codes (e.g., `AUTH_001`, `DB_001`)
- **Prisma errors**: Automatic handling of Prisma errors
- **Logging**: All errors are logged with context
- **JSON responses**: Standardized error format

**Response format**:

```json
{
    "status": 400,
    "code": "AUTH_001",
    "message": "Invalid credentials",
    "details": {}
}
```

### 11. 🐳 Docker (TBD)

## 🚀 Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **pnpm** or **yarn**
- **PostgreSQL**: v13 or higher
- **Docker** (optional): to run PostgreSQL locally

### Steps

1. **Clone the repository**:

```bash
git clone <repo-url>
cd fastify-prisma-better-auth
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

```bash
cp .env.example .env
# Edit .env with your values, .env.example contains the minimum configuration.
# All possible configuration parameters are defined in './src/config/config-schema.ts'
```

4. **Start PostgreSQL** (with Docker):

```bash
docker-compose up -d
```

5. **Generate Prisma client**:

```bash
npx prisma generate
```

6. **Run migrations**:

```bash
npx prisma migrate dev
```

7. **Start the server**:

```bash
npm run dev
```

The API will be accessible at `http://localhost:3000`

## 📦 Available Commands

### npm Scripts

#### Development

```bash
# Start in development mode (hot reload)
npm run dev

# Build the project
npm run build

# Start in production (after build)
npm start
```

#### Code Quality

```bash
# Lint the code
npm run lint

# Lint and fix automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting (CI)
npm run format:check
```

#### Tests

```bash
# Run tests (TBD)
npm test
```

### Prisma Commands

#### Migrations

```bash
# Create a new migration and apply it
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy

# Reset the database (DEV ONLY)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

#### Prisma Client

```bash
# Generate Prisma client (after schema change)
npx prisma generate

# Format schema.prisma file
npx prisma format
```

#### Database

```bash
# Push schema without creating a migration (prototyping)
npx prisma db push

# Open Prisma Studio (graphical interface)
npx prisma studio

# Seed the database (if seed script configured)
npx prisma db seed
```

## 🎨 ESLint, Prettier & Husky

### ESLint

ESLint configuration for TypeScript with strict rules.

**Configuration** (`eslint.config.js`):

- TypeScript parser with project support
- `@typescript-eslint` plugin for TS rules
- `import` plugin to manage imports
- Integration with Prettier (no conflicts)
- Ignore generated files (`src/generated/`, `dist/`)

**Main rules**:

- `@typescript-eslint/no-explicit-any: warn` - Avoid `any`
- `import/order` - Sort imports with blank line between groups
- `@typescript-eslint/no-unused-vars` - Unused variables (ignore `_` prefix)

**Usage**:

```bash
# Lint the entire project
npm run lint

# Fix automatically
npm run lint:fix
```

### Prettier

Automatic code formatting for consistent style.

**Configuration** (`.prettierrc`):

```json
{
    "trailingComma": "es5",
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "printWidth": 100
}
```

**Usage**:

```bash
# Format all files
npm run format

# Check formatting (without modifying)
npm run format:check
```

### Husky & lint-staged

Git hooks to ensure code quality before commit.

#### Husky Configuration

**Installation**:

```bash
npm run prepare
```

This installs Git hooks in `.husky/`.

**pre-commit hook** (`.husky/pre-commit`):

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

#### lint-staged Configuration

In `package.json`:

```json
{
    "lint-staged": {
        "*.{ts,js}": ["eslint --cache --fix", "prettier --write"],
        "*.{json,md,css}": ["prettier --write"]
    }
}
```

**What happens on commit**:

1. Husky intercepts `git commit`
2. Runs `lint-staged`
3. lint-staged:
    - Lints and fixes `.ts` and `.js` files
    - Formats with Prettier
    - Formats JSON, Markdown, CSS files
4. If errors, commit is blocked

#### Complete Setup (for new project)

If you're starting from scratch, here's how to configure everything:

```bash
# 1. Install dependencies
npm install -D husky lint-staged eslint prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-config-prettier \
  eslint-plugin-import

# 2. Initialize Husky
npx husky install

# 3. Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# 4. Create .prettierrc
echo '{
  "trailingComma": "es5",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 4,
  "printWidth": 100
}' > .prettierrc

# 5. Create eslint.config.js (see existing file)

# 6. Add lint-staged to package.json
npm pkg set lint-staged='{"*.{ts,js}":["eslint --cache --fix","prettier --write"],"*.{json,md,css}":["prettier --write"]}'
```

**Temporarily disable**:

```bash
# Skip hooks for a commit (not recommended)
git commit --no-verify -m "message"

# Temporarily disable Husky
export HUSKY=0
git commit -m "message"
```

## 🎮 Usage

### Example: Check permissions

```typescript
import { userCan } from './modules/authz';

// In a route handler
async function createInvoice(request, reply) {
    const userId = request.user.id;
    const organizationId = request.body.organizationId;

    // Check permission
    const allowed = await userCan(userId, 'invoice.create', { organizationId });

    if (!allowed) {
        return reply.status(403).send({ error: 'Forbidden' });
    }

    // Create invoice...
}
```

### Example: Maintenance mode

```typescript
// Enable maintenance mode
app.maintenance.enabled = true;
app.maintenance.startTime = new Date();

// All routes (except /maintenance and /monitoring) will return a 503 error
```

## 📁 Project Structure

```
fastify-prisma-better-auth/
├── src/
│   ├── index.ts                    # Entry point
│   ├── server.ts                   # Fastify configuration
│   ├── config/                     # Configuration & validation
│   │   ├── config-schema.ts
│   │   ├── correlation-logger.ts
│   │   └── index.ts
│   ├── errors/                     # Error handling
│   │   ├── custom-error.ts
│   │   ├── database-error.ts
│   │   ├── error-codes.ts
│   │   ├── maintenance-error.ts
│   │   └── catch-handlers/
│   │       └── prisma-error-handler.ts
│   ├── middlewares/                # Global middlewares
│   │   └── error-handler.ts
│   ├── modules/                    # Functional modules
│   │   ├── auth/                   # Authentication (Better Auth)
│   │   │   ├── auth.plugin.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   ├── authz/                  # Authorization (RBAC/ABAC)
│   │   │   ├── cache.ts
│   │   │   ├── evaluator.ts
│   │   │   ├── policy.ts
│   │   │   ├── rbac.ts
│   │   │   ├── types.ts
│   │   │   └── services/
│   │   ├── maintenance/            # Maintenance mode
│   │   │   ├── maintenance.plugin.ts
│   │   │   ├── maintenance.route.ts
│   │   │   └── dto/
│   │   └── monitoring/             # Health checks
│   │       ├── monitoring.plugin.ts
│   │       ├── monitoring.route.ts
│   │       └── monitoring.service.ts
│   ├── plugins/                    # Fastify plugins
│   │   ├── config.ts
│   │   ├── correlation-plugin.ts
│   │   ├── cors.ts
│   │   ├── prisma.ts
│   │   └── index.ts
│   ├── utils/                      # Utilities
│   │   └── context.ts
│   └── generated/                  # Generated by Prisma
│       └── prisma/
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                 # Migrations
│   └── seeding/                    # Seeds (to implement)
├── bruno/                          # Bruno collection (API tests)
│   └── fpauth/
├── .husky/                         # Git hooks
│   ├── pre-commit
│   └── _/
├── docker-compose.yml              # Docker Compose (PostgreSQL)
├── Dockerfile                      # Docker image of the app
├── eslint.config.js                # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── README.md
```

## 🛠️ Technologies Used

### Core

- **[Fastify](https://fastify.dev/)** (v5.6) - High-performance web framework
- **[TypeScript](https://www.typescriptlang.org/)** (v5.9) - Static typing
- **[Prisma](https://www.prisma.io/)** (v6.19) - Modern ORM
- **[Better Auth](https://www.better-auth.com/)** (v1.3) - Authentication

### Security & Middleware

- **[@fastify/cors](https://github.com/fastify/fastify-cors)** - CORS
- **[@fastify/helmet](https://github.com/fastify/fastify-helmet)** - HTTP security headers
- **[Zod](https://zod.dev/)** - Schema validation

### Authorization

- **[json-logic-js](https://github.com/jwadhams/json-logic-js)** - Policy evaluation

### Logging

- **[Pino](https://getpino.io/)** - High-performance logger (included in Fastify)
- **[pino-pretty](https://github.com/pinojs/pino-pretty)** - Pretty print for dev

### Code Quality

- **[ESLint](https://eslint.org/)** (v9.39) - Linter
- **[@typescript-eslint](https://typescript-eslint.io/)** - TypeScript rules for ESLint
- **[Prettier](https://prettier.io/)** (v3.6) - Code formatting
- **[Husky](https://typicode.github.io/husky/)** (v9.1) - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Lint on staged files

### Development

- **[tsx](https://github.com/privatenumber/tsx)** - TypeScript execution with hot reload
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variables

### Infrastructure

- **[Docker](https://www.docker.com/)** - Containerization
- **[PostgreSQL](https://www.postgresql.org/)** (v18) - Database

---

## 📚 Resources

- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Bruno API Client](https://www.usebruno.com/)

## 📄 License

ISC

## 👥 Author

William ISABELLE - Heksa SD
