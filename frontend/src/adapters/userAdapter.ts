import type { TFriendshipStatus } from "../types/backendTypes.ts";
import { FriendshipStatus } from "../types/backendTypes.ts";
import type { UserPreview } from "../types/userTypes.ts";

export function mapSearchResultToUser(
  result: ISearchResult
): UserPreview {
  return {
    id: result.userID,
    name: result.displayName,
    avatarUrl: result.avatarURL,
    presence: result.status ?? "UNKNOWN",
    relationship: mapFriendshipStatus(result.friendshipStatus),
  };
}

function mapFriendshipStatus(
  status: TFriendshipStatus
): UserPreview["relationship"] {
  switch (status) {
    case FriendshipStatus.ACCEPTED:
      return "FRIEND";
    case FriendshipStatus.PENDING_INCOMING:
      return "INCOMING_REQUEST";
    case FriendshipStatus.PENDING_OUTGOING:
      return "OUTGOING_REQUEST";
    default:
      return "NONE";
  }
}