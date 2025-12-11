import { createContext, useContext, useState, ReactNode } from "react";
import { PROXY_URL } from "../constants";

export interface Friend {
  id: number;
  displayName: string;
  avatarUrl: string;
}

export interface UserStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  // friends: Friend[];
  // stats: UserStats | null;
  role: "full" | "partial";
}

interface UserContextType {
  users: Record<string, User>;

  loadMe: () => Promise<void>;
  loadUser: (username: string) => Promise<void>;

  updateUser: (username: string, data: Partial<User>) => void;
  setDisplayName: (username: string, displayName: string) => void;
  setAvatar: (username: string, avatarUrl: string) => void;
  // setStats: (username: string, stats: UserStats) => void;
  // setFriends: (username: string, friends: Friend[]) => void;

  clearUsers: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Record<string, User>>({});

  /************************** */
  // Fetch /me (main user) 
  /************************** */
  
  async function loadMe() {
    try {
      const res = await fetch(PROXY_URL + "/me", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("/me failed");
        return;
      }

      const data = await res.json();
      const username = data.username;

      const user: User = {
        id: data.id,
        username,
        displayName: data.displayName ?? data.username,
        avatarUrl: data.avatarUrl,
        // friends: data.friends ?? [],
        // stats: data.stats ?? null,
        role: "full",
      };

      setUsers((prev) => ({ ...prev, [username]: user }));
    } catch (e) {
      console.error("Error loading /me", e);
    }
  }

  /****************************** */
  // Fetch /users/:username (side profiles)
  /****************************** */


  async function loadUser(username: string) {
    try {
      const res = await fetch(`${PROXY_URL}/users/${username}`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to load user", username);
        return;
      }

      const data = await res.json();

      const user: User = {
        id: data.id,
        username: data.username,
        displayName: data.displayName ?? data.username,
        avatarUrl: data.avatarUrl,
        // friends: data.friends ?? [],
        // stats: data.stats ?? null,
        role: "partial",
      };

      setUsers((prev) => ({ ...prev, [username]: user }));
    } catch (e) {
      console.error("Error fetching user", username, e);
    }
  }

  // ------------------------
  // Helpers
  // ------------------------


  function updateUser(username: string, data: Partial<User>) {
    setUsers((prev) => ({
      ...prev,
      [username]: { ...prev[username], ...data },
    }));
  }

  function setDisplayName(username: string, displayName: string) {
    updateUser(username, { displayName });
  }

  function setAvatar(username: string, avatarUrl: string) {
    updateUser(username, { avatarUrl });
  }

  // function setStats(username: string, stats: UserStats) {
  //   updateUser(username, { stats });
  // }

  // function setFriends(username: string, friends: Friend[]) {
  //   updateUser(username, { friends });
  // }

  function clearUsers() {
    setUsers({});
  }

  return (
    <UserContext.Provider
      value={{
        users,
        loadMe,
        loadUser,
        updateUser,
        setDisplayName,
        setAvatar,
        // setStats,
        // setFriends,
        clearUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be inside a UserProvider");
  return context;
}
