import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FriendService } from "../friendsService";

export class FriendController {
    private service: FriendService;

    constructor(fastify: FastifyInstance) {
        this.service = new FriendService(fastify);
    }


    sendRequest = async (
        req: FastifyRequest<{
            Body: { toUserId: number };
        }>,
        reply: FastifyReply
    ) => {
        const userId = Number(req.user.id);
        const { toUserId } = req.body;

        try {
            const res = await this.service.sendRequest(userId, toUserId);
            return reply.send(res);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    };

    getIncoming = async (req: FastifyRequest, reply: FastifyReply) => {
        const userId = Number(req.user.id);
        return reply.send(await this.service.getIncoming(userId));
    };

    getOutgoing = async (req: FastifyRequest, reply: FastifyReply) => {
        const userId = Number(req.user.id);
        return reply.send(await this.service.getOutgoing(userId));
    };

    accept = async (
        req: FastifyRequest<{ Params : { id: string } }>, 
        reply: FastifyReply
    ) => {
        const userId = Number(req.user.id);
        const requestId = Number(req.params.id);

        try {
            await this.service.acceptRequest(userId, requestId);
            return reply.send({ success: true });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    };

    reject = async (
        req: FastifyRequest<{ Params : { id: string } }>, 
        reply: FastifyReply
    ) => {
        const userId = Number(req.user.id);
        const requestId = Number(req.params.id);

        try {
            await this.service.rejectRequest(userId, requestId);
            return reply.send({ success: true });
        } catch (err: any) {
            return reply.code(400).send({ error: err.message });
        }
    };

    listFriends = async (req: FastifyRequest, reply: FastifyReply) => {
        const userId = Number(req.user.id);
        return reply.send(await this.service.getFriends(userId));
    };

    removeFriend = async (
        req: FastifyRequest<{ Params : { friendId: string } }>, 
        reply: FastifyReply
    ) => {
        const userId = Number(req.user.id);
        const friendId = Number(req.params.friendId);

        await this.service.removeFriend(userId, friendId);
        return reply.send({ success: true });
    }
}

