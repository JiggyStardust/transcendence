import "fastify";
import type { ExtendedPrismaClient } from "../database";

declare module "fastify" {
  interface FastifyInstance {
    db: ExtendedPrismaClient;
  }
}
