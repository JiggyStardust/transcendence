import "fastify";
import type { ExtendedPrismaClient } from "../database";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    db: ExtendedPrismaClient;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;
  }
}

