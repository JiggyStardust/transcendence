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

2. Open in a browser: `http://localhost:VITE_PORT/`
