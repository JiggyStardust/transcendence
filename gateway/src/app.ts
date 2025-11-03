import { fastify, FastifyInstance } from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import fs from "node:fs";
import path from "node:path";
import { appConfig } from "./config";

export const env = appConfig;

const keyPath = path.join("./certs", "localhost-key.pem");
const certPath = path.join("./certs", "localhost.pem");

export async function upServer() {
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    throw new Error(
      "HTTPS certificates not found. Please run the certificate generation step.",
    );
  }

  const server: FastifyInstance = fastify({
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
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
