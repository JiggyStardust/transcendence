
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { PROXY_URL } from "../constants";

export interface User {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
}

interface UserContextType {
  users: Record<string, User>;
  mainUser: User | null;

  loadMe: () => Promise<User | undefined>;
  loadUser: (username: string) => Promise<User | undefined>;

  updateUser: (username: string, data: Partial<User>) => void;
  setDisplayName: (username: string, displayName: string) => void;
  setAvatar: (username: string, avatarUrl: string) => void;

  clearUsers: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [mainUser, setMainUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});

  /************************** */
  // Fetch /me (main user) 
  /************************** */
  
  const loadMe = useCallback(async (): Promise<User | undefined> => {
    try {
      const res = await fetch(PROXY_URL + "/me", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("/me failed");
        return undefined;
      }

      const data = await res.json();
      const username = data.username;

      // console.log("Loaded me:", data);
      // console.log("avatarUrl:", data.avatarURL);

      const user: User = {
        id: data.id,
        username: data.username,
        displayName: data.displayName ?? data.username,
        avatarUrl: PROXY_URL + data.avatarURL,
        // role: "full",
      };

      setUsers((prev) => ({ ...prev, [username]: user }));
      setMainUser(user);
      return user;
    } catch (e) {
      console.error("Error loading /me", e);
      return undefined;
    }
    },[]
  );
  /****************************** */
  // Fetch /users/:username (side profiles)
  /****************************** */


  const loadUser = useCallback(async (username: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${PROXY_URL}/users/${username}`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to load user", username);
        return undefined;
      }

      const data = await res.json();

      // console.log("Loaded me:", data);
      // console.log("avatarUrl:", data.avatarURL);

      const user: User = {
        id: data.id,
        username: data.username,
        displayName: data.displayName ?? data.username,
        avatarUrl: PROXY_URL + data.avatarURL,
      };

      setUsers((prev) => ({ ...prev, [username]: user }));
      return user;
    } catch (e) {
      console.error("Error fetching user", username, e);
      return undefined;
    }
  },[]
  );

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

  function clearUsers() {
    setUsers({});
  }

  return (
    <UserContext.Provider
      value={{
        users,
        mainUser,
        loadMe,
        loadUser,
        updateUser,
        setDisplayName,
        setAvatar,
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
