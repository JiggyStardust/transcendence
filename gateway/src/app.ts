import { fastify, FastifyInstance } from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import fs from "node:fs";
import path from "node:path";
import { appConfig } from "./config";

export const env = appConfig;

export async function upServer() {
  const server: FastifyInstance = fastify({
    https: {
      key: fs.readFileSync(path.join("./certs", "localhost-key.pem")),
      cert: fs.readFileSync(path.join("./certs", "localhost.pem")),
    },
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
      level: "error",
    },
  });

  // proxy to frontend
  await server.register(fastifyHttpProxy, {
    upstream: env.FRONTEND_URL,
    websocket: true, // support WebSocket (HMR)
  });

  return server;
}
