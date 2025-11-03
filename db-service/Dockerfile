FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache curl && npm ci

COPY . ./
RUN npx prisma generate

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=5 \
    CMD curl -kfsS https://127.0.0.1:${PORT:-8082} || exit 1

CMD sh -c "npx prisma migrate deploy && npm run start:dev"
