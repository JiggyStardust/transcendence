import fp from "fastify-plugin";
import { db } from "../database";

/**
 * Prisma Database plugin
 * -------------
 * Registers a single Prisma client instance on the Fastify server
 * as `fastify.db`.
 *
 * Automatically disconnects Prisma when the server shuts down.
 */
export default fp(async (fastify) => {
  fastify.decorate("db", db);
  fastify.addHook("onClose", async () => {
    await db.$disconnect();
  });
});
