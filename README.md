# transcendence

## Quick start

**Prerequisites:**
- Docker & Docker Compose.
- Node.js.
- make sure `.env` exists and updated:
     ```sh
	 cp .env.example .env
	 nano .env
	 ```

**Run in Docker:**
1. Build and run both services:
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
1. Copy `.env` file to `backend` and `frontend` folders:
```bash
cp .env frontend/.env
cp .env backend/.env
```

2. Open terminal to run backend:
```bash
cd backend
npm run dev
```

3. Open new terminal to run frontend:
```bash
cd frontend
npm run dev
```

4. Open VITE local link in browser (ex. `http://localhost:5173/`)
