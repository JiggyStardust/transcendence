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
