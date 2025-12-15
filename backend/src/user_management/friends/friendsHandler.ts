import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FriendService } from "../../database/friends";

const REGEX_ONLY_DIGITS = /^\d+$/;
const INVALID_URL_OR_PROPS = "Invalid values: friend or user ID isn't a number";

const validateInput = (toUserID: string): number | undefined => {
  const parsedTo = parseInt(toUserID, 10);

  if (isNaN(parsedTo) || !REGEX_ONLY_DIGITS.test(toUserID)) {
    return undefined;
  }

  return parsedTo;
};

export class FriendHandler {
  private service: FriendService;

  constructor(fastify: FastifyInstance) {
    this.service = new FriendService(fastify);
  }

  connect = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const fromUserID = req.user.id;
    const toUserID = validateInput(req.params.friendID);

    if (toUserID === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      const res = await this.service.connectRequest(fromUserID, toUserID);
      return reply.send(res);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  accept = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const fromUserID = req.user.id;
    const toUserID = validateInput(req.params.friendID);

    if (toUserID === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      await this.service.acceptRequest(fromUserID, toUserID);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  reject = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const fromUserID = req.user.id;
    const toUserID = validateInput(req.params.friendID);

    if (toUserID === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      await this.service.rejectRequest(fromUserID, toUserID);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  delete = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const fromUserID = req.user.id;
    const toUserID = validateInput(req.params.friendID);

    if (toUserID === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      await this.service.deleteRequest(fromUserID, toUserID);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  listAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const friends = await this.service.listAllRequest(req.user.id);
      return reply.send({ success: true, data: friends });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };
}
