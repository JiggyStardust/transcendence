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
}

