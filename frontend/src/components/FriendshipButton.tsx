import { Button } from "./Button.tsx";
import { PROXY_URL } from "../constants/index.ts";
import type { FriendRelationship } from "../types/userTypes.ts";
import { useAppToast } from "../context/ToastContext";
import { useState, useEffect } from "react";


interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Send friend request
export const connectFriend = async (friendID: number): Promise<ApiResponse> => {
  // console.log("friendID: " + friendID);
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
  const [buttonState, setButtonState] = useState(status);
  const { showToast } = useAppToast();

  useEffect(() => {
    setButtonState(status);
  }, [status]);

  const handleClick = async () => {
    try {
      const message = buttonState === "INCOMING_REQUEST" 
        ? "Friend request successfully accepted" 
        : "Friend request sent";

      if (buttonState === "INCOMING_REQUEST") {
        await acceptFriend(userID);
        setButtonState("FRIEND");
      } else if (buttonState === "NONE") {
        await connectFriend(userID);
        setButtonState("OUTGOING_REQUEST");
      }
      showToast(message, "success");
    } catch (err: any) {
      // console.error(err.message);
      showToast(err.message, "error");
    }
  };

  const buttonConfig: Record<string, { label: string; disabled: boolean }> = {
    FRIEND: {
      label: "Friends",
      disabled: true,
    },
    INCOMING_REQUEST: {
      label: "Accept friend request",
      disabled: false,
    },
    OUTGOING_REQUEST: {
      label: "Requested",
      disabled: true,
    },
  };

  const { label, disabled } = buttonConfig[buttonState] || {
    label: "Add Friend",
    disabled: false,
  };

  return (
    <Button size="sm" disabled={disabled} onClick={handleClick}>
      {label}
    </Button>
  );
};

export default FriendshipButton;