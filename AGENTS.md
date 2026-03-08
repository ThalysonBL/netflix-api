# Agent guide (AGENTS.md)

This document guides AI agents to work on the **netflix-api** repository in line with the project architecture and conventions.

## Project overview

- **Name:** netflix-api
- **Type:** REST API (backend)
- **Purpose:** Authentication and user management (register, login with JWT).
- **Stack:** NestJS 11, TypeScript, Prisma 7, MySQL, JWT, bcrypt, class-validator.

## Principles

- **Clean Architecture:** Clear layers; business rules do not depend on framework or database.
- **Clean Code:** Clear names, small functions, DRY, single responsibility.
- **Language:** Code, error messages, logs, and user-facing text in **English**. No comments; keep code self-explanatory.
- **No placeholders:** Deliver complete, usable code; avoid "implement here" or empty TODOs.

## Architecture and layers

1. **Controllers** (`*.controller.ts`)
   - Handle HTTP (body, params, query).
   - Validate input via DTOs (ValidationPipe).
   - Delegate to services and return the response.
   - No business logic or direct database access.

2. **Services**
   - Orchestrate use cases (register, login, etc.).
   - May call repositories and other services.
   - Business rules (e.g. password hash, password comparison, JWT generation) live here, not in the repository.

3. **Repositories**
   - **Contract (port):** Abstract class/interface in the module (e.g. `UserRepository`).
   - **Implementation:** Concrete adapter (e.g. `PrismaUserRepository`).
   - **Only** persistence (CRUD, queries). No hash, no password validation, no JWT.
   - Repository receives/returns domain entities or types; HTTP DTOs are converted in the service before calling the repository.

4. **Entities**
   - Represent the domain (e.g. `User`).
   - Live under `modules/<module>/entities/`.
   - Avoid coupling to Prisma or HTTP (prefer plain interfaces/types).

5. **DTOs**
   - Under `modules/<module>/dto/`.
   - Validation with class-validator (`@IsString`, `@IsEmail`, `@MinLength`, etc.).
   - Used in controllers and, when needed, mapped to entities/CreateUserData in the service.

## Folder structure

```
src/
├── main.ts
├── app.module.ts
├── prisma/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.module.ts
│       ├── entities/
│       ├── errors/
│       ├── dto/
│       └── repositories/
│           ├── user.repository.ts
│           └── prisma/
│               └── prisma-user.repository.ts
prisma/
├── schema.prisma
├── prisma.config.ts
└── migrations/
```

New modules: create a folder under `src/modules/<name>/` with `*.module.ts`, controllers, services, and when there is persistence, `repositories/` + `entities/` and `dto/`.

## Database (Prisma + MySQL)

- **Provider:** MySQL.
- **URL:** Set in `prisma.config.ts` (env var `DATABASE_URL` in `.env`).
- **Schema:** `prisma/schema.prisma`; do not put `url` in the `datasource` block (Prisma 7).
- **Prisma 7 + MySQL:** The client requires an **adapter** in the constructor. `PrismaService` uses `@prisma/adapter-mariadb` (PrismaMariaDb) with `DATABASE_URL`; do not instantiate `PrismaClient` without an adapter.
- When adding or changing models: create a migration with `npx prisma migrate dev --name <name>` and run `npx prisma generate`.
- Repository implementations use injected `PrismaService`; prefer relative imports to `PrismaService` over `src/` alias.
- **Build:** The project uses `tsconfig.build.json` with `module: "commonjs"` for compatibility with the generated client; base `tsconfig.json` keeps `nodenext` for the editor.

## Authentication (JWT)

- Login in `AuthService`: find user by email (via `UsersService.findByEmail`), compare password with bcrypt, generate JWT with `JwtService.sign` (payload with `sub` and `email`).
- Login response: `{ access_token, user }`; never expose `password` in JSON.
- Register: password hashed in the **service** (UsersService) before calling the repository; repository persists already-hashed password.

## Code conventions

- **Imports:** Only what is needed; no unused imports.
- **Naming:** camelCase for methods and variables; names that reflect responsibility (e.g. `findByEmail`, `omitPassword`).
- **Language:** Error messages and user-facing text in English.
- **Comments:** Do not add comments; keep code self-explanatory.

## Adding features

- **New route:** Controller → service (and repository if needed). Keep validation in DTOs.
- **New entity/table:** Model in `prisma/schema.prisma`, migration, entity under `entities/`, abstract repository + Prisma implementation, service that uses the repository.
- **New module:** Folder under `modules/<name>/`, register the module in `app.module.ts`, correct providers/imports/exports.
- **Environment variables:** Document in README and use in `prisma.config.ts` or where needed (e.g. `JWT_SECRET`).

## Tests and quality

- Unit tests: `*.spec.ts` next to the file.
- E2E: `test/`, config in `jest-e2e.json`.
- Commands: `npm run test`, `npm run test:e2e`, `npm run lint`, `npm run format`.
- Ensure changes do not break the build: `npm run build`.

## Quick reference

- **Current routes:** `POST /auth/register`, `POST /auth/login`.
- **Modules:** Auth, Users (with repository), Prisma.
- **Environment:** `.env` with `DATABASE_URL` (MySQL) and `JWT_SECRET`.
