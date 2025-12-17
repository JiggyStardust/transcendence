export type PresenceStatus = "ONLINE" | "OFFLINE" | "UNKNOWN";

export type FriendRelationship =
  | "NONE"
  | "FRIEND"
  | "INCOMING_REQUEST"
  | "OUTGOING_REQUEST";

export interface UserPreview {
  id: number;
  name: string;
  avatarUrl: string;
  presence: PresenceStatus;
  relationship: FriendRelationship;
}