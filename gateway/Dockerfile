FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

EXPOSE 443

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=5 \
    CMD wget --quiet --tries=1 --spider https://localhost:443 || exit 1

CMD ["npx", "tsx", "watch", "src/index.ts"]
