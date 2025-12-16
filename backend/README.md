# Backend - Cookpac

A robust and scalable backend application built with Node.js, Express, TypeScript, and TypeORM.

## 📋 Table of Contents

- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development Scripts](#development-scripts)
- [Database Migrations](#database-migrations)
- [Architecture](#architecture)

## 🚀 Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **ORM**: TypeORM 0.3.x
- **Database**: PostgreSQL 16
- **Container**: Docker & Docker Compose
- **Dev Tools**: ts-node-dev for hot reloading

### Dependencies
- `express` - Fast, unopinionated web framework
- `typeorm` - TypeScript-first ORM for relational databases
- `pg` - PostgreSQL client for Node.js
- `cors` - Enable Cross-Origin Resource Sharing
- `dotenv` - Environment variable management
- `reflect-metadata` - Decorator support for TypeScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database)
- **Git**

## ⚙️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd cookpac/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🔧 Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=cookpac_db

# Add other environment variables as needed
# JWT_SECRET=your-secret-key
# JWT_EXPIRES_IN=7d
```

## 🗄️ Database Setup

### Starting the Database

The project uses PostgreSQL running in a Docker container.

```bash
# Start PostgreSQL database
npm run db:up

# Stop database (preserves data)
npm run db:down

# Reset database (removes all data and volumes)
npm run db:reset
```

### Database Credentials

Default credentials (defined in `db/docker-compose.yml`):
- **Host**: localhost
- **Port**: 5432
- **Database**: cookpac_db
- **Username**: postgres
- **Password**: postgres

## 🏃 Running the Application

### Development Mode

Run the application with hot-reloading:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Production Build

Build and run the production version:

```bash
# Build TypeScript to JavaScript
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
backend/
├── db/
│   └── docker-compose.yml      # PostgreSQL Docker configuration
├── src/
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── entities/               # TypeORM entities (database models)
│   │   ├── BaseEntity.ts
│   │   └── User.ts
│   ├── middlewares/            # Express middlewares
│   │   └── auth.middleware.ts
│   ├── migrations/             # Database migrations
│   │   └── 1765887235144-Init.ts
│   ├── repositories/           # Data access layer
│   │   └── user.repository.ts
│   ├── routes/                 # API route definitions
│   │   └── user.route.ts
│   ├── services/               # Business logic layer
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── app.ts                  # Express app configuration
│   ├── data-source.ts          # TypeORM data source configuration
│   └── server.ts               # Application entry point
├── package.json
├── tsconfig.json               # TypeScript configuration
└── README.md
```

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### User Management
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user by ID

> **Note**: Authentication middleware is planned for protected routes.

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run db:up` | Start PostgreSQL database container |
| `npm run db:down` | Stop database container |
| `npm run db:reset` | Reset database (removes all data) |
| `npm run migration:generate` | Generate new migration based on entity changes |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |

## 🔄 Database Migrations

TypeORM migrations track database schema changes over time.

### Generate a Migration

After modifying entities, generate a migration:

```bash
npm run migration:generate
```

### Run Migrations

Apply pending migrations to the database:

```bash
npm run migration:run
```

### Revert a Migration

Undo the last applied migration:

```bash
npm run migration:revert
```

## 🏗️ Architecture

This project follows a **layered architecture** pattern:

1. **Routes Layer** (`routes/`)
   - Defines API endpoints
   - Maps HTTP requests to controllers

2. **Controllers Layer** (`controllers/`)
   - Handles HTTP requests and responses
   - Validates request data
   - Calls appropriate services

3. **Services Layer** (`services/`)
   - Contains business logic
   - Orchestrates operations
   - Independent of HTTP concerns

4. **Repositories Layer** (`repositories/`)
   - Data access layer
   - Interacts with database via TypeORM
   - Abstracts database operations

5. **Entities Layer** (`entities/`)
   - Database models
   - TypeORM entities with decorators
   - Defines database schema

### Dependency Injection

The project uses manual dependency injection for loose coupling:

```typescript
const userRepository = new UserRepository(AppDataSource);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
```

## 📝 Best Practices

- **Environment Variables**: Never commit `.env` files
- **Migrations**: Always create migrations for schema changes
- **Type Safety**: Leverage TypeScript for type-safe code
- **Error Handling**: Implement proper error handling in controllers
- **Validation**: Validate request data before processing
- **Logging**: Add proper logging for debugging and monitoring

## 🔐 Security Considerations

- [ ] Implement authentication middleware
- [ ] Add input validation
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Use HTTPS in production
- [ ] Implement CORS properly for production

## 🚧 Planned Features

- [ ] Complete authentication system (JWT)
- [ ] Add more entity types
- [ ] Implement comprehensive error handling
- [ ] Add request validation middleware
- [ ] Add unit and integration tests
- [ ] API documentation with Swagger/OpenAPI
- [ ] Logging system

## 📄 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines here]

---

For any questions or issues, please contact the development team.
