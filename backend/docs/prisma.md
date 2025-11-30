# Database Setup (Prisma + Fastify)

This project uses **Prisma ORM** with an **extended Prisma client** to keep database logic modular, typed, and uniform across all API layers.

---

### Database structure

<img width="1358" height="721" alt="Image" src="https://github.com/user-attachments/assets/52516be2-ef50-44df-bfc1-e0a978f36b48" />

### Prisma Studio

Run command `npx prisma studio` to inspect data using Prisma ui interface.

### Unified return format

All custome database operations return a consistent shape:

```ts
{
  ok: boolean;
  data: T | string;
}
```

*Examples:*
- Success:
```json
{ "ok": true, "data": { "id": 1, "username": "alice" } }
```
- Error:
```json
{ "ok": false, "data": "NOT_FOUND" } }
```

This allows routes and services to handle database results in a predictable way, e.g.:
```ts
if (!res.ok) return reply.code(404).send({ ok: false, data: res.data });
```

### Extended Prisma client

In addition to the built-in [Prisma Client API queries](https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismaclient) custom utilities from `backend/src/database/utils/*` are dynamically imported and attached to an extended Prisma client in backend `/src/database/index.ts`. This extended client is then registered as a Fastify plugin (`backend/src/plugin/database.ts`), providing **access to db anywhere in the app** through the Fastify server instance — no extra imports needed.

### Custom methods:
- `db.createUser(username, passwordHash, displayName?)` -> `Promise<DbResult<INewUserData>>`
- `db.getUser(username)` -> `Promise<DbResult<IUserData>>`

All custom types -> `backend/src/database/types.ts`
