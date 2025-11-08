# Authentication API

Handles user registration and login, issuing JWT access and refresh tokens.

## Signup

**Endpoint:** `POST /signup`

**Description:** Creates a new user account. Hashes the provided password using bcrypt and stores the user in the database.

**Request body**
```json
{
  "username": "alice",
  "password": "secret123"
}
```
`{..."displayName": "alice_in_borderland" }` (optional)

## Login

**Endpoint:** `POST /login`

**Description:** Authenticates a user with username and password. If successful, returns both an access token and a refresh token.

**Request body**
```json
{
  "username": "alice",
  "password": "secret123"
}
```

**Implementation details**

- Located in `src/authentication/*`.
- Uses extended Prisma client available as `req.server.db`.
