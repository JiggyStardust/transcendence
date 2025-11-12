import type {
  FastifyReply,
  FastifyRequest,
  FastifyPluginAsync,
  RouteShorthandOptions,
  RawServerDefault,
} from "fastify";
import type { IncomingMessage, ServerResponse } from "http";
import type { DbResult, IUserData } from "../database/types";

type CheckUsernameQuery = {
  username: string;
};

const checkUsernameOpts: RouteShorthandOptions<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  { Querystring: CheckUsernameQuery }
> = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        username: {
          type: "string",
          minLength: 3,
          // TODO: Discuss username normalization rules
          // maxLength: 30,
          // pattern: "^[a-zA-Z0-9_]+$",
        },
      },
      required: ["username"],
      additionalProperties: false,
    },
    response: {
      200: {
        type: "object",
        properties: {
          available: { type: "boolean" },
        },
        required: ["available"],
        additionalProperties: false,
      },
    },
  },
};

const checkUsernameHandler = async (
  req: FastifyRequest<{ Querystring: CheckUsernameQuery }>,
  reply: FastifyReply,
) => {
  const { username } = req.query;
  const user: DbResult<IUserData> = await req.server.db.getUser(username);
  const available = !user.ok;
  return { available };
};

const checkUsernameRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: CheckUsernameQuery }>(
    "/check-username",
    checkUsernameOpts,
    checkUsernameHandler,
  );
};

export default checkUsernameRoute;
