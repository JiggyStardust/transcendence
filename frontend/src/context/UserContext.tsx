import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { PROXY_URL } from "../constants";

// For friend list, not sure if this is the info we want
export interface Friend {
  id: number;
  displayName: string;
  avatarUrl?: string | null;
}

// a placeholder for game stats, not sure if this is what we want/what we're going to have in database
export interface UserStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
}

export interface User {
  id: number;
  username: string; // not sure if we need this at all 
  displayName: string;
  avatarUrl: string | null;
  friends: Friend[];
  stats: UserStats | null;
	role: "full" | "partial"; // we have a main user logged in (full) and others have partial (no profile editing)
}

interface UserContextType {
  user: User | null;
  loadUser: () => Promise<void>;

  updateUser: (data: Partial<User>) => void;
  
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) { // anything react can render
  const { accessToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  // Fetch user profile from backend
  async function loadUser() {
    if (!accessToken) return;

    const res = await fetch(PROXY_URL + "/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      console.error("Failed to load user profile");
      return;
    }

    const data = await res.json();

    // Expecting backend response to match User structure later on.
    setUser({
      id: data.id,
      username: data.username,
      displayName: data.displayName ?? "", // if undefined, use the value on the right
      avatarUrl: data.avatarUrl ?? null, // we might have a default pic then?
      friends: data.friends ?? [],
      stats: data.stats ?? null
    });
  }

// Update only specific fields (patch)
function updateUser(data: Partial<User>) {
  setUser((prev: User) => {
    if (!prev) {
			return prev; // No user loaded yet
		}
    return { ...prev, ...data };
  });
}

  function setDisplayName(displayName: string) {
    updateUser({ displayName });
  }

  function setAvatar(avatarUrl: string | null) {
    updateUser({ avatarUrl });
  }

  function setStats(stats: UserStats) {
    updateUser({ stats });
  }

  function setFriends(friends: Friend[]) {
    updateUser({ friends });
  }

  function clearUser() { // clear on logout
    setUser(null);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loadUser,
        setDisplayName,
        setAvatar,
        setStats,
        setFriends,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return context;
}