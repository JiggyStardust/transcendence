# Pong Backeng
Backend API for a multiplayer Pong game — built with Fastify, Prisma, and TypeScript.

Handles user authentication, game and user profile management.

## Structure

```txt
backend/
├── docs/                     # Documentation
├── prisma/                   # Prisma (schema, migrations, dev DB)
├── src
│   ├── authentication/       # Auth service
│   ├── constants/            # Common constants & env variables
│   ├── database/             # Prisma extensions/helpers
│   ├── plugin/               # Fastify plugins
│   ├── routes/               # API routes
│   ├── types/*.d.ts          # Type extensions (e.g., Fastify)
│   └── server.ts             # Entry point
├── package.json
├── package-lock.json
├── tsconfig.json
├── Dockerfile
├── .dockerignore
└── README.md
```

## Quick start

- `npm run dev`

Installs dependencies, runs Prisma migrations (which also generates the client), then starts the project in hot-reload mode with `tsx watch src/server.ts`.

- `npm run start`

Runs in production mode: performs a clean install with `npm ci`, applies migrations with `prisma migrate deploy`, and starts the server with `tsx src/server.ts`.

- `npx prisma studio`

Opens Prisma Studio — a visual interface for browsing and editing your database.

----

## Development notes

**Prisma + Docker**

The directory `./backend/prisma` is bind-mounted to `/app/prisma`, ensuring that all SQLite changes inside the container are mirrored on the host system and visible in Prisma Studio.

**Fastify plugin**

Database:
- Prisma is registered as a Fastify plugin and exposed globally as `fastify.db`.
- Within route handlers, it can be accessed through `req.server.db`.
- No explicit export from the plugin is required.

**Code layout**

Database:
- Custom database logic resides in `src/database/`.
- Utility functions under `src/database/utils/` are imported and extended in `src/database/index.ts`, providing direct access to methods such as `db.createUser()` or `db.isUserExists()`.
- Reference for built-in Prisma queries: [Prisma Client API reference](https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismaclient)

**Documentation**
- Update the documentation whenever new functionality, routes, or configuration options are added.
- Keep endpoint descriptions, environment variables, and database changes in sync with the codebase.
