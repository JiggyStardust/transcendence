import { FastifyInstance } from "fastify";
import { FriendHandler } from "../user_management/friends/friendsHandler";
import { verifyToken } from "../authentication/authMiddleware";

export default async function friendsRoutes(fastify: FastifyInstance) {
  const handler = new FriendHandler(fastify);

  fastify.post("/:friendID/connect", { preHandler: verifyToken, handler: handler.connect });
  fastify.post("/:friendID/accept", { preHandler: verifyToken, handler: handler.accept });
  fastify.post("/:friendID/reject", { preHandler: verifyToken, handler: handler.reject });
  fastify.delete("/:friendID/delete", { preHandler: verifyToken, handler: handler.delete });
}
