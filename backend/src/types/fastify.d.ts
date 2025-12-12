import "fastify";
import "@fastify/jwt"
import type { ExtendedPrismaClient } from "../database";
import { FastifyRequest, FastifyReply } from "fastify";
import { JwtPayload } from "@fastify/jwt";

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

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: number;
      username: string;
      displayName?: string;
    } & JwtPayload;
    jwtVerify: () => Promise<void>;
  }
}


