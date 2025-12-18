import { Button } from "./Button.tsx";
import { PROXY_URL } from "../constants/index.ts";
import type { FriendRelationship } from "../types/userTypes.ts";


interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Send friend request
export const connectFriend = async (friendID: number): Promise<ApiResponse> => {
  console.log("friendID: " + friendID);
  const res = await fetch(PROXY_URL + `/friends/${friendID}/connect`, {
    method: "POST",
  });
  return res.json();
};

// Accept a friend request
export const acceptFriend = async (friendID: number): Promise<ApiResponse> => {
  const res = await fetch(PROXY_URL + `/friends/${friendID}/accept`, {
    method: "POST",
  });
  return res.json();
};

// Reject a friend request
export const rejectFriend = async (friendID: number): Promise<ApiResponse> => {
  const res = await fetch(PROXY_URL + `/friends/${friendID}/reject`, {
    method: "POST",
  });
  return res.json();
};

// Delete a friend / cancel request
export const deleteFriend = async (friendID: number): Promise<ApiResponse> => {
  const res = await fetch(PROXY_URL + `/friends/${friendID}/delete`, {
    method: "DELETE",
  });
  return res.json();
};

interface FriendshipButtonProps {
  status: FriendRelationship;
  userID: number;
}

const FriendshipButton = ({ status, userID }: FriendshipButtonProps) => {
  let label: string;
  let action: (() => Promise<void>) | null = null;

  switch (status) {
    case "FRIEND":
			label = "Friends";
      break;

    case "INCOMING_REQUEST":
      label = "Accept friend request";
      action = async () => {
        await acceptFriend(userID);
      };
      break;

    case "OUTGOING_REQUEST":
      label = "Requested";
      break;

    default:
      label = "Add Friend";
      action = async () => {
        await connectFriend(userID);
      };
      break;
  }

  const handleClick = async () => {
    if (!action) return;
    try {
      await action();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const disabled =
    status === "FRIEND" ||
    status === "OUTGOING_REQUEST";

  return (
    <Button size="sm" disabled={disabled} onClick={handleClick}>
      {label}
    </Button>
  );
};

export default FriendshipButton;