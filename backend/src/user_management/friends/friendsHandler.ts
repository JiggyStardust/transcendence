import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FriendService } from "../../database/friends";

const REGEX_ONLY_DIGITS = /^\d+$/;
const INVALID_URL_OR_PROPS = "Invalid values: friend or user ID isn't a number";

const validateInput = (fromUserID: string, toUserID: string): { fromUserID: number; toUserID: number } | undefined => {
  const parsedFrom = parseInt(fromUserID, 10);
  const parsedTo = parseInt(toUserID, 10);

  if (
    isNaN(parsedFrom) ||
    isNaN(parsedTo) ||
    !REGEX_ONLY_DIGITS.test(fromUserID) ||
    !REGEX_ONLY_DIGITS.test(toUserID)
  ) {
    return undefined;
  }

  return {
    fromUserID: parsedFrom,
    toUserID: parsedTo,
  };
};

export class FriendHandler {
  private service: FriendService;

  constructor(fastify: FastifyInstance) {
    this.service = new FriendService(fastify);
  }

  connect = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const props = validateInput(req.user.id, req.params.friendID);

    if (props === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      const res = await this.service.connectRequest(props.fromUserID, props.toUserID);
      return reply.send(res);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  accept = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const props = validateInput(req.user.id, req.params.friendID);

    if (props === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      await this.service.acceptRequest(props.fromUserID, props.toUserID);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  reject = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const props = validateInput(req.user.id, req.params.friendID);

    if (props === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      await this.service.rejectRequest(props.fromUserID, props.toUserID);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };

  delete = async (req: FastifyRequest<{ Params: { friendID: string } }>, reply: FastifyReply) => {
    const props = validateInput(req.user.id, req.params.friendID);

    if (props === undefined) {
      return reply.code(400).send({ error: INVALID_URL_OR_PROPS });
    }

    try {
      await this.service.deleteRequest(props.fromUserID, props.toUserID);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  };
}
