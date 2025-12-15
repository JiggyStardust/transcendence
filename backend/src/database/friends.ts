import { FastifyInstance } from "fastify";
import { FriendStatus, UserStatus } from "@prisma/client";

export interface IFriend {
  userID: number;
  username: string;
  displayName: string;
  avatarURL: string;
  status: UserStatus;
}

const USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarURL: true,
  status: true,
} as const;

export interface IListFriends {
  accepted: IFriend[];
  pendingIncoming: IFriend[];
  pendingOutgoing: IFriend[];
}

export type TSearchFriendsQuery = {
  search: string;
};

enum FriendshipStatus {
  DEFAULT = "DEFAULT",
  ACCEPTED = "ACCEPTED",
  PENDING_INCOMING = "PENDING_INCOMING",
  PENDING_OUTGOING = "PENDING_OUTGOING",
}

type TFriendshipStatus = FriendshipStatus;

export interface ISearchResult {
  userID: number;
  displayName: string;
  avatarURL: string;
  status: UserStatus | "UKNOWN";
  friendshipStatus: TFriendshipStatus;
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
          { userID: fromUserID, friendID: toUserID, status: FriendStatus.PENDING },
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
    const [friends, incoming, outgoing] = await Promise.all([
      this.fastify.db.friend.findMany({
        where: { userID, status: FriendStatus.ACCEPTED },
        select: { friend: { select: USER_SELECT } },
      }),
      this.fastify.db.friend.findMany({
        where: { friendID: userID, status: FriendStatus.PENDING },
        select: { user: { select: USER_SELECT } },
      }),
      this.fastify.db.friend.findMany({
        where: { userID, status: FriendStatus.PENDING },
        select: { friend: { select: USER_SELECT } },
      }),
    ]);

    const accepted = friends.map((r: any) => r.friend as IFriend);
    const pendingIncoming = incoming.map((r: any) => r.user as IFriend);
    const pendingOutgoing = outgoing.map((r: any) => r.friend as IFriend);

    return { accepted, pendingIncoming, pendingOutgoing };
  }

  friendshipStatus = async (userID: number, friendID: number): Promise<TFriendshipStatus> => {
    const row = await this.fastify.db.friend.findFirst({
      where: {
        OR: [
          { userID, friendID },
          { userID: friendID, friendID: userID },
        ],
      },
      select: { userID: true, friendID: true, status: true },
    });

    if (!row) return FriendshipStatus.DEFAULT;
    if (row.status === FriendStatus.ACCEPTED) return FriendshipStatus.ACCEPTED;

    return row.userID === userID ? FriendshipStatus.PENDING_OUTGOING : FriendshipStatus.PENDING_INCOMING;
  };

  async searchRequest(userID: number, key: string): Promise<ISearchResult[]> {
    const users = await this.fastify.db.user.findMany({
      where: {
        displayName: { startsWith: key },
        NOT: { id: userID },
      },
      select: USER_SELECT,
      take: 20,
    });

    const results: ISearchResult[] = await Promise.all(
      users.map(async (user: any) => {
        const friendshipStatus = await this.friendshipStatus(userID, user.id);

        const friend: IFriend = {
          userID: user.id,
          username: user.username,
          displayName: user.displayName,
          status: user.status,
          avatarURL: user.avatarURL,
        };

        const searchRes: ISearchResult = {
          userID: friend.userID,
          displayName: friend.displayName,
          avatarURL: friend.avatarURL,
          status: friendshipStatus === FriendStatus.ACCEPTED ? friend.status : "UKNOWN",
          friendshipStatus,
        };

        return searchRes;
      }),
    );

    return results;
  }
}
