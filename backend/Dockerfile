# (development mode)
FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache curl && npm install

COPY ./tsconfig*.json .

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=5 \
    CMD curl -fsS http://127.0.0.1:${BACKEND_PORT:-4000}|| exit 1

CMD ["npm", "run", "dev"]
