import { FastifyInstance } from "fastify";
import { FriendController } from "authentication/friendsController";

export default async function friendsRoutes(fastify: FastifyInstance) {
    const controller = new FriendController(fastify);

    fastify.post("/friends/request", controller.sendRequest);
    fastify.get("/friends/requests/incoming", controller.getIncoming);
    fastify.get("/friends/requests/outgoing", controller.getOutgoing);

    fastify.post("/friends/request/:id/accept", controller.accept);
    fastify.post("/friends/request/:id/reject", controller.reject);

    fastify.get("/friends", controller.listFriends);
    fastify.delete("/friends/:friendId", controller.removeFriend);
}
