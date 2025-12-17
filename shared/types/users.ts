import { type UserStatus } from "../../backend/node_modules/.prisma/client/index.ts";
import { type TFriendshipStatus } from "../../backend/src/database/friends.ts"

export interface ISearchResult {
  userID: number;
  displayName: string;
  avatarURL: string;
  status: UserStatus | "UNKNOWN";
  friendshipStatus: TFriendshipStatus;
}