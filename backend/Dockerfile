# Development Dockerfile - Fastify for Node.js
FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["npm", "run", "dev"]
