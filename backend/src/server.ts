// import framework and instantiate it
import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import databasePlugin from "./plugin/database";
import userRoutes from "./routes/users";
import "dotenv/config";

const PORT = parseInt(process.env.BACKEND_PORT ?? "4000");
const HOST = process.env.BACKEND_HOST || "localhost";

const fastify = Fastify({ logger: { level: "error" } });

// register middleware
fastify.register(cors, { origin: true });
fastify.register(formbody);

// register custom plugins
fastify.register(databasePlugin);

// register route module
fastify.register(userRoutes);

// declare a basic route
fastify.get("/", async (request, reply) => {
  return { message: "Hello PingPong!" };
});

fastify.get("/health", async (request, reply) => {
  return { ok: true };
});

//run the server
const start = async () => {
  try {
    fastify.listen({ host: HOST, port: PORT });
    console.log("Server running on http://" + HOST + ":" + PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
