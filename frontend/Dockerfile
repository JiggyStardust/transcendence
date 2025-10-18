# Development Dockerfile - Vite dev server
FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# expose Vite dev server port
# (alternative to run nginx server to accces site)
# @NOTE: nginx might be needed to run in prod
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# run Vite dev server (will be available on http://localhost:3000/)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
