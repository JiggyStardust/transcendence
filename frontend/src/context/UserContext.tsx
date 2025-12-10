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
  friends: Friend[];
  stats: UserStats | null;
  role: "full" | "partial";
}

interface UserContextType {
  users: User[];

  loadUsers: (ids: number[]) => Promise<void>;

  updateUser: (id: number, data: Partial<User>) => void;
  setDisplayName: (id: number, displayName: string) => void;
  setAvatar: (id: number, avatarUrl: string) => void;
  setStats: (id: number, stats: UserStats) => void;
  setFriends: (id: number, friends: Friend[]) => void;

  clearUsers: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  async function fetchSingleUser(id: number): Promise<User | null> {
    try {
      const res = await fetch(`${PROXY_URL}/getplayers`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        console.error("Failed to load user", id);
        return null;
      }

      const data = await res.json();

      return {
        id: data.id,
        username: data.username,
        displayName: data.displayName ?? data.username,
        avatarUrl: data.avatarUrl,
        friends: data.friends ?? [],
        stats: data.stats ?? null,
        role: "partial", // will adjust main user later
      };
    } catch (e) {
      console.error("Error fetching user", id, e);
      return null;
    }
  }

  async function loadUsers(ids: number[]) {
    const results = await Promise.all(ids.map(fetchSingleUser));
    const clean = results.filter(Boolean) as User[];

    // Mark the first one as main user
    if (clean.length > 0) {
      clean[0].role = "full";
    }

    setUsers(clean);
  }

  function updateUser(id: number, data: Partial<User>) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
  }

  function setDisplayName(id: number, displayName: string) {
    updateUser(id, { displayName });
  }

  function setAvatar(id: number, avatarUrl: string) {
    updateUser(id, { avatarUrl });
  }

  function setStats(id: number, stats: UserStats) {
    updateUser(id, { stats });
  }

  function setFriends(id: number, friends: Friend[]) {
    updateUser(id, { friends });
  }

  function clearUsers() {
    setUsers([]);
  }

  return (
    <UserContext.Provider
      value={{
        users,
        loadUsers,
        updateUser,
        setDisplayName,
        setAvatar,
        setStats,
        setFriends,
        clearUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside a UserProvider");
  return context;
}
