# transcendence

## Quick start

**Prerequisites:**
- Docker & Docker Compose.
- Node.js.

**Run in Docker:**
1. Build and run both services:
   - make sure `.env` exists and edited:
     ```sh
	 cp .env.example .env
	 nano .env
	 ```
   - Start in foreground:
     ```sh
     make run
     ```
   - Start detached:
     ```sh
     make run-detach
     ```

2. Open in a browser: `http://localhost:5173/`

**Run locally:**
1. Open terminal to run backend:
```bash
cd backend
PORT=4000 npm run dev
```
2. Open new terminal to run frontend:
```bash
cd frontend
VITE_BACKEND_INTERNAL_URL=http://localhost:4000 npm run dev
```

3. Open local link in browser (ex. `http://localhost:3000/`)
