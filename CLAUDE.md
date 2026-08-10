# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server with hot reload (tsx watch src/server.ts)
npm run build         # type-check and compile to dist/ (tsc)
npm start             # run compiled server (node dist/server.js)
npm run db:generate   # regenerate Prisma client after schema changes
npm run db:migrate    # create/apply a migration in dev (prisma migrate dev)
npm run db:seed       # reset seed data (runs prisma/seed/seed.ts via prisma.config.ts)
```

There is no test suite and no lint/format tooling configured in this repo yet.

Requires a `.env` with `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONT_END_URL`, `REFRESH_TOKEN_COOKIE_NAME`, and optional `PORT`/`NODE_ENV` — validated by [src/common/config/env.schema.ts](src/common/config/env.schema.ts) at startup (process exits if invalid).

## Architecture

Express + TypeScript REST API on Postgres/Prisma. No web framework beyond Express, no DI container — wiring is manual.

### Layering

Each feature lives under `src/modules/<name>/` with a consistent stack, wired together in a `*.module.ts` file:

```
*.routes.ts      Router factory: declares paths, attaches authenticate/validate middleware, binds controller methods
*.controller.ts  Extracts req.user / req.params / req.validated, calls the service, sets the HTTP response
*.service.ts     Business rules, authorization checks, orchestration across repositories
*.repository.ts  Only place Prisma is queried directly; takes a DbClient (PrismaClient | Prisma.TransactionClient)
*.module.ts      Instantiates repository -> service -> controller -> routes and exports the router
validators/      Zod schemas per route (body/params/query), each exporting a `*Dto` type via z.infer
```

`*.module.ts` files construct their own dependencies with `new` and pass the shared `prisma` client in — see [src/modules/task/task.module.ts](src/modules/task/task.module.ts) for a module that also depends on another module's repository directly (`ProjectRepository`, `ProjectMemberRepository`) rather than going through that module's service. Follow this pattern when a new module needs cross-module reads.

Routers are mounted in [src/app.ts](src/app.ts). Some modules own their own path prefix (e.g. `authRouter` mounted at `/auth`), others declare full paths internally and are mounted at `/` (e.g. `taskRouter`, `commentRouter`) because they nest under another resource's path (`/projects/:projectId/tasks`, `/tasks/:taskId`).

### Request pipeline

- `validate(schema, target)` ([src/common/middleware/validate.middleware.ts](src/common/middleware/validate.middleware.ts)) parses `body`/`params`/`query` with a Zod `ZodObject` and stores the result on `req.validated.<target>` — controllers read from `req.validated`, never from raw `req.body`/`req.query`.
- `authenticate` ([src/common/middleware/authenticate.middleware.ts](src/common/middleware/authenticate.middleware.ts)) reads a `Bearer` access token, verifies it, and sets `req.user = { id }`. Controllers pull the caller id via `requireUser(req)` ([src/common/utils/require-user.ts](src/common/utils/require-user.ts)), which throws `UnauthorizedError` if unset.
- `globalErrorHandler` ([src/common/middleware/error.middleware.ts](src/common/middleware/error.middleware.ts)) is the single place HTTP status codes get decided for errors: `AppError` subclasses map to their `statusCode`, `ZodError` maps to 400 with field errors, and known Prisma error codes (`P2002` conflict, `P2025` not found, `P2034` transaction conflict) are translated. Services/repositories should throw, not format responses.
- Custom errors live in `src/common/errors/` (`BadRequestError`, `ConflictError`, `ForbiddenError`, `NotFoundError`, `UnauthorizedError`), all extending `AppError`, re-exported from `src/common/errors/index.ts`.

### Auth model

JWT access token (short-lived, sent as `Authorization: Bearer`) + refresh token (stored server-side). Refresh tokens are issued as httpOnly cookies (`refreshTokenCookieOptions` in [src/common/config/cookie.config.ts](src/common/config/cookie.config.ts), scoped to path `/auth`) and are session-backed: each login creates a `Session` row keyed by a `sid` embedded in the refresh JWT, storing a *hashed* refresh token (via the same bcrypt helper used for passwords). Refresh/logout flows look up the session by `sid`, verify the token hash matches, and rotate it on refresh. See [src/modules/auth/auth.service.ts](src/modules/auth/auth.service.ts).

### Authorization model

No middleware-level RBAC — project membership and role checks (`ProjectRole`: `OWNER` / `ADMIN` / `MEMBER`) are performed inline in services by looking up the caller's `ProjectMember` row, e.g. [src/modules/project-member/project-member.service.ts](src/modules/project-member/project-member.service.ts). Resource lookups are consistently scoped to the requesting user's membership (e.g. `findByTaskIdAndUserId` joins through `project.members.some({ userId })`), which makes "not found" and "not authorized" indistinguishable to the caller by design. Multi-step permission changes that touch more than one table (e.g. removing a project member and unassigning their tasks) run inside a `Serializable` Prisma transaction.

### Data model

See [prisma/schema.prisma](prisma/schema.prisma). Key shape: `User` owns `Project`s; `Project` has `ProjectMember`s (role-based), `Label`s, and `Task`s; `Task` has an optional assignee, a `createdBy`, `Comment`s, and many-to-many `Label`s via `TaskLabel`. `User`, `Project`, `Task`, `Comment` use soft delete (`deletedAt`); `ProjectMember`, `Session`, `TaskLabel` are hard-deleted.

Because soft delete coexists with uniqueness constraints, uniqueness is enforced with hand-written partial unique indexes added via raw SQL in migrations (not expressible in `schema.prisma` directly) — e.g. project name unique per owner only among non-deleted rows, user email unique only among non-deleted rows. When adding a new unique constraint on a soft-deletable model, add a migration with a partial index (`WHERE "deletedAt" IS NULL`) rather than a plain `@@unique`.

Repository methods that need to participate in a caller's transaction accept an optional trailing `db` parameter defaulting to the injected client (e.g. `unassignByProjectIdAndAssigneeId(projectId, assigneeId, db = this.db)`), so services can pass a `Prisma.TransactionClient` through.

### Seeding

`prisma/seed/seed.ts` wipes and repopulates the DB inside a single transaction, running per-entity seed modules in dependency order (users -> projects -> project members -> labels -> tasks -> comments -> task labels). The seed command is configured in [prisma.config.ts](prisma.config.ts) (`migrations.seed`), not in `package.json`.
