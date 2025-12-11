import { FastifyInstance } from "fastify";
import { FriendService } from "../friendsService";

export class FriendController {
    private service: FriendService;

    constructor(fastify: FastifyInstance) {
        this.service = new FriendService(fastify);
    }

    sendRequest = async (req: any, reply: any) => {
        const userId = req.user.id;
        const { toUserId } = req.body;

        try {
            const res = await this.service.sendRequest(userId, toUserId);
            return reply.send(res);
        } catch (err: any) {
            return reply.badRequest(err.message);
        }
    };

    getIncoming = async (req: any, reply: any) => {
        const userId = req.user.id;
        return reply.send(await this.service.getIncoming(userId));
    };

    getOutgoing = async (req: any, reply: any) => {
        const userId = req.user.id;
        return reply.send(await this.service.getOutgoing(userId));
    };

    accept = async (req: any, reply: any) => {
        const userId = req.user.id;
        const requestId = Number(req.params.id);

        try {
            await this.service.acceptRequest(userId, requestId);
            return reply.send({ success: true });
        } catch (err: any) {
            return reply.badRequest(err.message);
        }
    };
}

