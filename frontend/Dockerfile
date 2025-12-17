# Development Dockerfile - Vite dev server
FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache curl && npm install

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=5 \
    CMD sh -lc 'curl -kfsS https://127.0.0.1:${VITE_PORT:-5173}/ >/dev/null || exit 1'

CMD ["npm", "run", "dev"]
