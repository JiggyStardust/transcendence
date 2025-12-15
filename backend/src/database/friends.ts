import { FastifyInstance } from "fastify";
import { FriendStatus, UserStatus } from "@prisma/client";

export interface IFriend {
  userID: number;
  username: string;
  displayName: string;
  avatarURL: string;
  status: UserStatus;
}

export interface IListFriends {
  accepted: IFriend[];
  pendingIncoming: IFriend[];
  pendingOutgoing: IFriend[];
}

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

  async listAllRequest(userID: number): Promise<IListFriends> {
    const userSelect = {
      id: true,
      username: true,
      displayName: true,
      status: true,
      avatarURL: true,
    } as const;

    const [friends, incoming, outgoing] = await Promise.all([
      this.fastify.db.friend.findMany({
        where: { userID, status: FriendStatus.ACCEPTED },
        select: { friend: { select: userSelect } },
      }),
      this.fastify.db.friend.findMany({
        where: { friendID: userID, status: FriendStatus.PENDING },
        select: { user: { select: userSelect } },
      }),
      this.fastify.db.friend.findMany({
        where: { userID, status: FriendStatus.PENDING },
        select: { friend: { select: userSelect } },
      }),
    ]);

    const accepted = friends.map((r: any) => r.friend as IFriend);
    const pendingIncoming = incoming.map((r: any) => r.user as IFriend);
    const pendingOutgoing = outgoing.map((r: any) => r.friend as IFriend);

    return { accepted, pendingIncoming, pendingOutgoing };
  }
}
