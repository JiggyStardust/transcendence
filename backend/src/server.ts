import "dotenv/config";
import path from "path";

import Fastify from "fastify";

import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

import authPlugin from "./plugin/authPlugin";
import databasePlugin from "./plugin/database";

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import checkUsernameRoute from "./routes/checkUsername";
import avatarRoutes from "./routes/avatar";
import friendsRoutes from "./routes/friendRoutes";

const PORT = parseInt(process.env.BACKEND_PORT ?? "4000");
const HOST = process.env.BACKEND_HOST || "localhost";

const fastify = Fastify({ logger: { level: "error" } });

// register cookies
fastify.register(fastifyCookie, {
  secret: "a_random_secret_key", // used for signed cookies
});

// register jwt plugin
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

fastify.register(authPlugin);

export default fastify;

// register middleware
fastify.register(cors, {
  origin: ["http://" + HOST + ":" + PORT],
  credentials: true,
});
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
fastify.register(friendsRoutes, { prefix: "/friends" });

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
