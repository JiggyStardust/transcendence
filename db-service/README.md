# Pong DB Service — Quick Start
### 1) Run Locally
```bash
cd db-service
npm install
```
### 2. Set up environment
Create a file named `.env` in the project root:
```txt
DATABASE_URL="file:./dev.db"
HOST="localhost"
PORT="3000"
```
*Optional:* You can override the port when starting (`PORT=8080 npm run start:dev`).
### 3. Run Prisma migrations
```bash
npx prisma migrate deploy
```
### 4. Start the service
```bash
npm run start:dev
```

## Run Tests
Unit & Integration: `npm run test`

End-to-End (Fastify + in-memory SQLite): `npm run test:e2e`

## Try it out
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordHash":"$2b$10$..."}'
```
