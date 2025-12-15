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
    user: 
      | ( JwtPayload& {
        id: number;
        username: string;
        displayName?: string;
    })
    | string
    | object
    | Buffer
    jwtVerify: () => Promise<void>;
  }
}


