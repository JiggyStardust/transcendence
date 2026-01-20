# Ping of Pongs

A full‑stack web application centered around the creation of a modern, multiplayer Pong gaming platform. 
The project combines real‑time gameplay, secure authentication, tournaments, and social features inside a single‑page application.

Our website allows users to play classic Pong directly in the browser, compete in tournaments, manage profiles, and interact with other players. 
The application focuses on real‑time interaction, security, and clean architecture while respecting some technical constraints.

## Features

### Game
-  Classic Pong gameplay (with a twist in multiplayer mode)
-  Local multiplayer (same keyboard)
-  Tournament system with automatic matchmaking
-  Match history stored and displayed in main user's profile
-  Babylon.js used for game rendering

### User & Social
- User registration and authentication
- JWT-based authentication
- Two-Factor Authentication (2FA)
- Profile management and customization
- Add and manage friends

### Security
- Password hashing
- Strict password requirements
- Secure API routes
- Input validation in both frontend and backend
- HTTPS

### Technical Requirements
- Single page application
- Compatible with the latest Mozilla Firefox and expanded browser compatibility
- No unhandled runtime errors or warnings
- Fully containerized with Docker (single command setup)

## Getting started

### Prerequisites
- Docker
- Docker Compose
- .env file (example found in the repository)

### Running the project

```make```

See Makefile to inspect the commands like cleaning or running in detach mode.

Open a browser with https://localhost:xxxx (port defined in your .env) and **start exploring!**
