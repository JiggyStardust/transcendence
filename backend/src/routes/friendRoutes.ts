import type { FastifyInstance, RouteShorthandOptions, RawServerDefault } from "fastify";
import type { IncomingMessage, ServerResponse } from "http";
import { FriendHandler } from "../user_management/friends/friendsHandler";
import { TSearchFriendsQuery } from "../database/friends";
import { verifyToken } from "../authentication/authMiddleware";

export const searchFriendsOpts: RouteShorthandOptions<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  { Querystring: TSearchFriendsQuery }
> = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        search: {
          type: "string",
          minLength: 1,
        },
      },
      required: ["search"],
      additionalProperties: false,
    },
  },
  preHandler: verifyToken,
};

export default async function friendsRoutes(fastify: FastifyInstance) {
  const handler = new FriendHandler(fastify);

  fastify.post("/:friendID/connect", { preHandler: verifyToken, handler: handler.connect });
  fastify.post("/:friendID/accept", { preHandler: verifyToken, handler: handler.accept });
  fastify.post("/:friendID/reject", { preHandler: verifyToken, handler: handler.reject });
  fastify.delete("/:friendID/delete", { preHandler: verifyToken, handler: handler.delete });

  fastify.get("/all", { preHandler: verifyToken, handler: handler.listAll });
  fastify.get<{ Querystring: TSearchFriendsQuery }>("/", searchFriendsOpts, handler.search);
}
