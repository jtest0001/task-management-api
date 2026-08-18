# Task Management API

A production-oriented **REST API for collaborative task management**, built with **Node.js, Express, TypeScript, Prisma and PostgreSQL**.

The API provides authentication, session management, projects, members, tasks, comments and labels while demonstrating layered backend architecture, authorization, validation, transactional data access and centralized error handling.

🌐 **Frontend:** https://task-management-client-vert.vercel.app
💻 **Frontend Repository:** https://github.com/jtest0001/task-management-client

---

## Features

### Authentication

* User registration
* User login
* JWT access tokens
* Refresh-token sessions
* Refresh-token rotation
* Secure `httpOnly` refresh cookies
* Logout
* Session-backed authentication

### Projects

* Create projects
* Retrieve projects
* Update projects
* Soft-delete projects
* Project ownership

### Project Members

* Add members to projects
* Assign project roles
* Update member roles
* Remove members
* Automatically unassign tasks when members are removed

### Tasks

* Create tasks
* Retrieve individual tasks
* List project tasks
* Update tasks
* Soft-delete tasks
* Assign tasks to project members
* Status and priority management
* Due dates
* Pagination
* Filtering
* Searching
* Sorting

### Comments

* List task comments
* Create comments
* Update comments
* Delete comments
* Author-based authorization

### Labels

* Create project labels
* Update labels
* Delete labels
* Attach labels to tasks
* Remove labels from tasks

### Authorization

Project access uses role-based permissions:

```text
OWNER
ADMIN
MEMBER
```

Business-level authorization is enforced inside the service layer rather than relying on frontend visibility rules.

---

## Tech Stack

### Runtime

* Node.js 22
* TypeScript
* Express 5

### Database

* PostgreSQL
* Prisma ORM

### Authentication & Security

* JSON Web Tokens
* bcrypt
* `httpOnly` cookies
* Helmet
* CORS
* Express Rate Limit
* Redis-backed rate limiting support

### Validation

* Zod

### Logging

* Pino

### Development

* tsx
* Prisma Migrate

---

## Architecture

The API uses a **feature-based layered architecture**.

```text
src/
├── common/
│   ├── config/
│   ├── errors/
│   ├── middleware/
│   └── utils/
│
├── modules/
│   ├── auth/
│   ├── project/
│   ├── project-member/
│   ├── task/
│   ├── comment/
│   ├── label/
│   └── task-label/
│
├── types/
├── app.ts
└── server.ts
```

Each feature follows a consistent internal structure:

```text
feature/
├── feature.routes.ts
├── feature.controller.ts
├── feature.service.ts
├── feature.repository.ts
├── feature.module.ts
└── validators/
```

---

## Layer Responsibilities

### Routes

Routes define:

* endpoint paths
* authentication middleware
* validation middleware
* controller handlers

```text
Request
   │
   ▼
Router
```

### Controllers

Controllers handle HTTP-specific concerns.

Responsibilities include:

* reading authenticated user information
* reading validated request data
* calling services
* setting HTTP responses

Controllers do not contain business logic.

```text
Router
   │
   ▼
Controller
```

### Services

Services contain application business rules.

Responsibilities include:

* authorization
* resource ownership
* membership checks
* cross-repository orchestration
* transactional workflows

```text
Controller
   │
   ▼
Service
```

### Repositories

Repositories contain database access.

Prisma queries are isolated from controllers and services and executed through repository classes.

```text
Service
   │
   ▼
Repository
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

Repositories accept a shared database client abstraction that can represent either:

```text
PrismaClient
```

or:

```text
Prisma.TransactionClient
```

This allows the same repository methods to participate in transactions without duplicating database logic.

---

## Request Lifecycle

A typical authenticated request follows:

```text
HTTP Request
     │
     ▼
Middleware
     │
     ├── Authentication
     ├── Validation
     └── Request context
     │
     ▼
Controller
     │
     ▼
Service
     │
     ├── Business rules
     └── Authorization
     │
     ▼
Repository
     │
     ▼
Prisma
     │
     ▼
PostgreSQL
```

Errors propagate back through the centralized error handler.

---

## Validation

Incoming requests are validated with **Zod**.

Validation can target:

```text
body
params
query
```

Validated values are stored on:

```ts
req.validated
```

Controllers therefore consume validated data instead of reading raw request input directly.

This ensures request validation happens before business logic executes.

---

## Authentication Architecture

Authentication uses short-lived JWT access tokens together with server-backed refresh sessions.

```text
Login
   │
   ├── Access JWT
   │      └── returned to client
   │
   └── Refresh JWT
          │
          ├── httpOnly cookie
          └── associated with Session record
```

The access token is sent with protected requests:

```http
Authorization: Bearer <access-token>
```

The refresh token is stored in an `httpOnly` cookie so frontend JavaScript cannot directly access it.

Each login creates a server-side session associated with the refresh token.

---

## Refresh Token Rotation

Refresh sessions are rotated when a token is refreshed.

Conceptually:

```text
Refresh Request
      │
      ▼
Verify JWT
      │
      ▼
Find Session
      │
      ▼
Validate Stored Token
      │
      ▼
Rotate Refresh Token
      │
      ├── issue new access token
      └── issue new refresh token
```

This allows sessions to be invalidated server-side rather than relying exclusively on stateless JWT expiration.

---

## Authorization Model

Authorization operates at the project level.

### OWNER

Project owners have full administrative control over the project.

Typical capabilities include:

* update project
* delete project
* manage members
* manage member roles
* manage labels
* manage tasks

### ADMIN

Administrators can perform project administration while remaining restricted from owner-specific operations.

Typical capabilities include:

* manage project members
* manage labels
* manage tasks

### MEMBER

Members participate in project work.

Typical capabilities include:

* view project data
* create and manage tasks according to project rules
* attach labels
* create comments
* update or delete their own comments

The backend remains the final authorization boundary.

---

## Error Handling

Errors are handled centrally instead of formatting responses throughout controllers and services.

Application errors derive from a common base error and include types such as:

```text
BadRequestError
ConflictError
ForbiddenError
NotFoundError
UnauthorizedError
```

The global error handler also translates known infrastructure errors.

Examples include:

```text
Zod validation error       → 400
Authentication failure     → 401
Authorization failure      → 403
Resource not found         → 404
Unique constraint conflict → 409
```

Known Prisma errors are also converted into appropriate application responses.

---

## Database

The application uses PostgreSQL through Prisma.

Core domain relationships include:

```text
User
 │
 ├── Sessions
 │
 ├── Owned Projects
 │
 └── Project Memberships
        │
        ▼
      Project
        │
        ├── Members
        ├── Tasks
        └── Labels
              │
              ▼
          Task Labels

Task
 │
 ├── Assignee
 ├── Creator
 ├── Comments
 └── Labels
```

Some resources use soft deletion so application records can be retained without remaining active.

---

## Environment Variables

Create a `.env` file in the project root.

Required configuration includes:

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
FRONT_END_URL=
REFRESH_TOKEN_COOKIE_NAME=
```

Optional configuration includes:

```env
PORT=3000
NODE_ENV=development
```

Environment configuration is validated when the application starts. Invalid or missing required configuration prevents the server from starting.

Do not commit `.env` files containing secrets.

---

## Getting Started

### Prerequisites

Install:

* Node.js 22
* npm
* PostgreSQL

Alternatively, use a hosted PostgreSQL provider.

---

### 1. Clone the repository

```bash
git clone https://github.com/jtest0001/task-management-api.git
cd task-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env
```

and provide the required configuration.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run database migrations

```bash
npm run db:migrate
```

### 6. Seed the database

Optional:

```bash
npm run db:seed
```

### 7. Start the development server

```bash
npm run dev
```

By default the API runs at:

```text
http://localhost:3000
```

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the server using `tsx` with file watching.

### Build

```bash
npm run build
```

Generates Prisma Client and compiles TypeScript.

### Production

```bash
npm start
```

Runs the compiled application.

### Prisma Client

```bash
npm run db:generate
```

Regenerates Prisma Client.

### Development Migration

```bash
npm run db:migrate
```

Creates and applies database migrations in development.

### Seed Database

```bash
npm run db:seed
```

Runs the database seed.

### Production Migration

```bash
npm run db:deploy
```

Applies existing Prisma migrations in a production environment.

---

## Security Considerations

The API includes multiple security layers:

* password hashing
* short-lived access tokens
* server-backed refresh sessions
* `httpOnly` refresh cookies
* refresh-token rotation
* request validation
* CORS configuration
* Helmet security headers
* API rate limiting
* role-based authorization
* centralized error handling

Authorization decisions are performed by the backend service layer and are never delegated to the frontend.

---

## Frontend

The companion React application is available at:

https://github.com/jtest0001/task-management-client

The frontend is built with:

* React
* TypeScript
* TanStack Query
* React Hook Form
* Zod
* Tailwind CSS
* shadcn/ui

Live application:

https://task-management-client-vert.vercel.app

---

## Project Goals

This project was built as a production-style backend rather than a minimal CRUD API.

It demonstrates practical approaches to:

* REST API design
* layered backend architecture
* authentication and session management
* authorization
* relational database modelling
* transactions
* soft deletion
* validation
* pagination and filtering
* centralized error handling
* dependency composition
* secure API development
* maintainable TypeScript architecture

---

## License

This project is intended for personal and portfolio use.
