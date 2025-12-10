import { FastifyInstance } from "fastify";
import { FriendStatus } from "@prisma/client";

export class FriendService {
    constructor(private fastify: FastifyInstance) {}

    // send a friend request
    async sendRequest(userId: number, toUserId: number) {
        if (userId === toUserId) {
            throw new Error("Cannot friend yourself"); // should this be a numerical error?
        }
    

    // existing friend
        const existing = await this.fastify.db.friend.findFirst({
            where: {
                userID: userId,
                friendID: toUserId,
            },
        });
        
        if (existing) {
            throw new Error("Friend request already exists");
        }
        
        return this.fastify.db.friend.create({
            data: {
                userID: userId,
                friendID: toUserId,
                status: FriendStatus.PENDING,
            },
        });
    }

    // incoming friend requests
    async getIncoming(userID: number) {
        return this.fastify.db.friend.findMany({
            where: {
                friendID: userID,
                status: FriendStatus.PENDING,
            },
        });
    }

    // outgoing friend requests
    async getOutgoing(userID: number) {
        return this.fastify.db.friend.findMany({
            where: {
                userID: userID,
                status: FriendStatus.PENDING,
            },
            include: {
                friend: true,
            },
        });
    }

    // accept request
    async acceptRequest(userID: number, requestID: number) {
        const req = await this.fastify.db.friend.findUnique({
            where: { id: requestID },
        });

        if (!req || req.friendID !== userID) {
            throw new Error("Request does not exist or is not yours");
        }

        // Accept orginal
        await this.fastify.db.friend.update({
            where: { id: requestID },
            data: { status: FriendStatus.ACCEPTED },
        });

        // create reciprocal friendship
        await this.fastify.db.friend.create({
            data: {
                userID: userID,
                friendID: req.userID,
                status: FriendStatus.ACCEPTED,
            },
        });

        return true;
    }

    // reject request
    async rejectRequest(userID: number, requestID: number) {
        const req = await this.fastify.db.friend.findUnique({
            where: { id: requestID },
        });

        if (!req || req.friendID !== userID) {
            throw new Error("Request does not exist or is not yours");
        }

        await this.fastify.db.friend.delete({ where: { id: requestID } });

        return true;
    }

    // get friendlist
    async getFriends(userId: number) {
        return this.fastify.db.friend.findMany({
            where: {
                userID: userId,
                status: FriendStatus.ACCEPTED,
            },
            include: {
                friend: true,
            },
        });
    }

    // remove friend (both rows)
    async removeFriend(userId: number, friendId: number) {
        await this.fastify.db.friend.deleteMaany({
            where: {
                OR: [
                    { userID: userId, friendID: friendId },
                    { userID: friendId, friendID: userId },
                ],
            },
        });
        return true;
    }
}