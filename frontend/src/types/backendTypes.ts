export const UserStatus = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  UNKNOWN: "UNKNOWN",
} as const;

export type TUserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface IFriend {
  userID: number;
  username: string;
  displayName: string;
  avatarURL: string;
  status: TUserStatus;
}

export interface IListFriends {
  accepted: IFriend[];
  pendingIncoming: IFriend[];
  pendingOutgoing: IFriend[];
}

export const FriendshipStatus = {
  DEFAULT: "DEFAULT",
  ACCEPTED: "ACCEPTED",
  PENDING_INCOMING: "PENDING_INCOMING",
  PENDING_OUTGOING: "PENDING_OUTGOING",
} as const;

export type TFriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus];

export interface ISearchResult {
  userID: number;
  displayName: string;
  avatarURL: string;
  status: TUserStatus;
  friendshipStatus: TFriendshipStatus;
}

export interface IMatchHistoryData {
  matchId: number;    // I probably will not use this
  createdAt: string;  // "2025-12-16T15;31:12.680Z"
  isWinner: boolean;  // (is the main user a winner)
  userScore: number;  // (main users score)
  opponentScore: number;
  opponentDisplayName: string;
  opponentAvatarUrl: string;
}