# Database Service — API Reference

Run (local): `npm run start`

Base URL (local): `http://localhost:3000` -> in local setup will lead to the Swagger UI for docs and tests.

Auth (in progress): current contract - none auth required (internal service).

Content-Type: application/json

Dates: ISO-8601 strings (e.g., 2025-11-04T12:00:00.000Z)

Status codes:
  - `200 OK` — success
  - `201 Created` — resource created/rotated/updated
  - `400 Bad Request` — invalid/malformed payload
  - `401 Unauthorized` — invalid credentials or token mismatch/expired
  - `409 Conflict` — duplicate username on register

### Endpoints

#### 1) Register
`POST /auth/register`
Creates a new user.

**Request**
```json
{
  "username": "alice",
  "displayName": "Alice",
  "passwordHash": "$2b$10$..."   // bcrypt hash
}
```
The service assumes `passwordHash` is already bcrypt-hashed by the caller.

**Responses**
201 Created
```json
{
  "message": "User successfully created",
  "user": {
    "id": "u_123",
    "username": "alice",
    "createdAt": "2025-11-02T10:00:00.000Z"
  }
}
```

409 Conflict
```json
{ "statusCode": 409, "message": "Username already taken", "error": "Conflict" }
```

500 Internal Server Error
```json
{ "statusCode": 500, "message": "Could not create user", "error": "Internal Server Error" }
```

**cURL**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordHash":"$2b$10$..."}'
```

**Fastify app**
```ts
const payload = {
  username: "alice",
  displayName: "Alice",
  passwordHash: await bcrypt.hash("secret", 10),
};

const res = await app.inject({
  method: "POST",
  url: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/auth/register`,
  payload,
});
```

#### 2) Login

`POST /auth/login`
Verifies credentials (username + password).

**Request**
```json
{ "username": "alice", "password": "secret" }
```

**Responses**
200 OK
```json
{
  "message": "User successfully logged in",
  "user": {
    "id": "u_123",
    "username": "alice",
    "isTwoFactorEnabled": false
  }
}
```

401 Unauthorized
```json
{ "statusCode": 401, "message": "Invalid credentials", "error": "Unauthorized" }
```

**cURL**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret"}'
```

**Fastify app**
```ts
const payload = {
  username: "alice",
  // displayName: "Alice", // optional
  password: "raw-secret-pass",
};

const res = await app.inject({
  method: "POST",
  url: `http://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/auth/login`,
  payload,
});
```

#### 3) Logout

`POST /auth/logout`
Revokes the current refresh token (idempotent).

**Request**
```json
{
  "username": "alice",
  "jti": "optional-current-jti"    // optional: revoke only if JTI matches
}
```

**Responses**

200 OK
```json
{
  "message": "Logged out",
  "user": { "id": "u_123", "username": "alice" }
}
```
If there is no token or it’s already revoked, the endpoint still returns success (idempotent).

**cURL**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","jti":"jti-123"}'
```

#### 4) Set Token (internal)

`PUT /auth/users/:username/set-token`
Creates or updates the user’s refresh token record.
Path Params: `:username` — target user.

**Request**
```json
{
  "jti": "jti-123",
  "hashedToken": "sha256-or-hmac256-of-raw-token",
  "expiresAt": "2025-11-03T12:00:00.000Z"
}
```
Security: store deterministic hashes (e.g., HMAC-SHA256) for refresh tokens; do not store raw tokens. Bcrypt is randomized and not suitable for deterministic comparison across services.

**Responses**

201 Created
```json
{
  "message": "Token updated",
  "user": { "id": "u_123", "username": "alice" }
}
```

401 Unauthorized
```json
{ "statusCode": 401, "message": "Invalid credentials", "error": "Unauthorized" }
```

**cURL**
```bash
curl -X PUT http://localhost:3000/auth/users/alice/set-token \
  -H "Content-Type: application/json" \
  -d '{"jti":"jti-123","hashedToken":"abcd...","expiresAt":"2025-11-03T12:00:00.000Z"}'
```

#### 5) Rotate Token (internal)

`PUT /auth/users/:username/rotate-token`
Rotates the existing refresh token to a new one (atomic).
Path Params: `:username` — target user

**Request**
```json
{
  "currentJti": "old-jti",
  "currentHashedToken": "hash-of-old",
  "newJti": "new-jti",
  "newHashedToken": "hash-of-new",
  "newExpiresAt": "2025-11-04T12:00:00.000Z"
}
```
Validation rules:
- Current record must exist, not revoked, and not expired.
- currentJti and currentHashedToken must match stored values.
- newJti should differ from currentJti.

**Responses**

201 Created
```json
{
  "message": "Refresh token rotated",
  "user": { "id": "u_123", "username": "alice" },
  "token": { "jti": "new-jti", "expiresAt": "2025-11-04T12:00:00.000Z" }
}
```

401 Unauthorized
```json
{ "statusCode": 401, "message": "Invalid credentials", "error": "Unauthorized" }
```

**cURL**
```bash
curl -X PUT http://localhost:3000/auth/users/alice/rotate-token \
  -H "Content-Type: application/json" \
  -d '{
    "currentJti":"old-jti",
    "currentHashedToken":"hash-of-old",
    "newJti":"new-jti",
    "newHashedToken":"hash-of-new",
    "newExpiresAt":"2025-11-04T12:00:00.000Z"
  }'
```


### Entities (Responses)
```json
# UserResponseEntity
{
  "id": string,
  "username": string,
  "displayName"?: string,
  "createdAt"?: string,           // ISO date
  "isTwoFactorEnabled"?: boolean
}

# TokenResponseEntity
{
  "jti": string,
  "expiresAt": string             // ISO date
}

# AuthResponseEntity
{
  "message": string,
  "user": UserResponseEntity,
  "token"?: TokenResponseEntity
}
```
