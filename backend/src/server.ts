// import framework and instantiate it
import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import path from "path";
import databasePlugin from "./plugin/database";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import checkUsernameRoute from "./routes/checkUsername";
import avatarRoutes from "./routes/avatar";
import "dotenv/config";

const PORT = parseInt(process.env.BACKEND_PORT ?? "4000");
const HOST = process.env.BACKEND_HOST || "localhost";

const fastify = Fastify({ logger: { level: "error" } });

// register middleware
fastify.register(cors, { origin: true });
fastify.register(formbody);

// register other plugins
fastify.register(import("@fastify/multipart"), {
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
    files: 1, // only 1 file allowed
  },
});
fastify.register(import("@fastify/static"), {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

// register custom plugins
fastify.register(databasePlugin);

// register route module
fastify.register(userRoutes);
fastify.register(authRoutes);
fastify.register(checkUsernameRoute, { prefix: "/users" });
fastify.register(avatarRoutes, { prefix: "/users" });

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
