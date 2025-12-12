import { FastifyInstance } from "fastify";
import { FriendStatus } from "@prisma/client";

export class FriendService {
  constructor(private fastify: FastifyInstance) {}

  // send a friend request
  async connectRequest(fromUserID: number, toUserID: number) {
    if (fromUserID === toUserID) {
      throw new Error("Requested userID and friendID are the same");
    }

    const friendUserProfile = await this.fastify.db.user.findUnique({
      where: { id: toUserID },
      select: { id: true },
    });

    if (friendUserProfile === null) {
      throw new Error("Requested friend user doesn't exist");
    }

    const friendRequestID = await this.fastify.db.friend.findFirst({
      where: {
        OR: [
          { userID: fromUserID, friendID: toUserID },
          { userID: toUserID, friendID: fromUserID },
        ],
      },
      select: { id: true },
    });

    if (friendRequestID !== null) {
      throw new Error("Friend request already exists");
    }

    return this.fastify.db.friend.create({
      data: {
        userID: fromUserID,
        friendID: toUserID,
        status: FriendStatus.PENDING,
      },
    });
  }

  async acceptRequest(fromUserID: number, toUserID: number) {
    if (fromUserID === toUserID) {
      throw new Error("Requested userID and friendID are the same");
    }

    const friendUserProfile = await this.fastify.db.user.findUnique({
      where: { id: toUserID },
      select: { id: true },
    });

    if (friendUserProfile === null) {
      throw new Error("Requested friend user doesn't exist");
    }

    const friendRequest = await this.fastify.db.friend.findUnique({
      where: {
        userID_friendID: {
          userID: toUserID,
          friendID: fromUserID,
        },
        status: FriendStatus.PENDING,
      },
      select: { id: true },
    });

    if (friendRequest === null) {
      throw new Error("Request to become friends doesn't exist or already accepted");
    }

    try {
      await this.fastify.db.friend.update({
        where: { id: friendRequest.id },
        data: { status: FriendStatus.ACCEPTED },
      });
    } catch (error) {
      throw new Error("Updating friend status failed");
    }

    await this.fastify.db.friend.upsert({
      where: {
        userID_friendID: {
          userID: fromUserID,
          friendID: toUserID,
        },
      },
      update: { status: FriendStatus.ACCEPTED },
      create: {
        userID: fromUserID,
        friendID: toUserID,
        status: FriendStatus.ACCEPTED,
      },
    });
  }

  async rejectRequest(fromUserID: number, toUserID: number) {
    if (fromUserID === toUserID) {
      throw new Error("Requested userID and friendID are the same");
    }

    const friendUserProfile = await this.fastify.db.user.findUnique({
      where: { id: toUserID },
      select: { id: true },
    });

    if (friendUserProfile === null) {
      throw new Error("Requested friend user doesn't exist");
    }

    const friendRequest = await this.fastify.db.friend.findUnique({
      where: {
        userID_friendID: {
          userID: toUserID,
          friendID: fromUserID,
        },
        status: FriendStatus.PENDING,
      },
      select: { id: true },
    });

    if (friendRequest === null) {
      throw new Error("Request to become friends doesn't exist or already accepted");
    }

    await this.fastify.db.friend.delete({
      where: { id: friendRequest.id },
    });
  }

  async deleteRequest(fromUserID: number, toUserID: number) {
    if (fromUserID === toUserID) {
      throw new Error("Requested userID and friendID are the same");
    }

    const friendUserProfile = await this.fastify.db.user.findUnique({
      where: { id: toUserID },
      select: { id: true },
    });

    if (friendUserProfile === null) {
      throw new Error("Requested friend user doesn't exist");
    }

    const friendship = await this.fastify.db.friend.findFirst({
      where: {
        OR: [
          { userID: fromUserID, friendID: toUserID, status: FriendStatus.ACCEPTED },
          { userID: toUserID, friendID: fromUserID, status: FriendStatus.ACCEPTED },
        ],
      },
      select: { id: true },
    });

    if (friendship === null) {
      throw new Error("Friendship does not exist");
    }

    await this.fastify.db.friend.deleteMany({
      where: {
        OR: [
          { userID: fromUserID, friendID: toUserID },
          { userID: toUserID, friendID: fromUserID },
        ],
      },
    });

    return true;
  }
}
