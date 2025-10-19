FROM node:24.10.0-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# fixed port for healthcheck
EXPOSE 8015

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8015 || exit 1

CMD ["npm", "run", "dev"]
