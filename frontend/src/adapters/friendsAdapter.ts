import { type IListFriends } from "../types/backendTypes.ts";
import { type UserPreview } from "../types/userTypes.ts";

export function mapFriendsList(data: IListFriends) {
  
  const accepted: UserPreview[] = (data.accepted || []).map(friend => ({
    id: friend.userID,
    name: friend.displayName,
    avatarUrl: friend.avatarURL,
    presence: friend.status ?? "UNKNOWN",
    relationship: "FRIEND",
  }));

  const incoming: UserPreview[] = (data.pendingIncoming || []).map(friend => {
    console.log("Mapping friend:", friend);
    return {
      id: friend.userID,
      name: friend.displayName,
      avatarUrl: friend.avatarURL,
      presence: friend.status ?? "UNKNOWN",
      relationship: "INCOMING_REQUEST",
    };
  });

  const outgoing: UserPreview[] = (data.pendingOutgoing || []).map(friend => ({
    id: friend.userID,
    name: friend.displayName,
    avatarUrl: friend.avatarURL,
    presence: friend.status ?? "UNKNOWN",
    relationship: "OUTGOING_REQUEST",
  }));

  return ({
    accepted,
    incoming,
    outgoing
  });
}