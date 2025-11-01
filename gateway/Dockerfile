FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache curl && npm ci

COPY tsconfig.json ./
COPY src ./src

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=5 \
    CMD curl -kfsS https://127.0.0.1:${PORT:-4443} || exit 1

CMD ["npx", "tsx", "watch", "src/index.ts"]
