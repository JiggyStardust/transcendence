import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { PROXY_URL } from "../constants";

// below we define what values or functions are accessed with AuthContext

interface AuthContextType {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null); // is first initialized with null

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // This check is here, so after refresh we see if we are still online in backend (have cookies/tokens)
  // This is because we don't have online-status setup in backend yet. So we see if mainuser can fetch with /me,
  // which is only possible when main user is online/has tokens set.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(PROXY_URL + "/me", { credentials: "include" });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsAuthenticated(false);
      }
    })();
  }, []);


  function login() {
    // cookies are set in the backend, no storing tokens anymore
    setIsAuthenticated(true);
  }

  async function logout() {
    // THIS WILL BE ADDED AFTER BACKEND HAS /logout ENDPOINT

    try {
      await fetch(PROXY_URL + "/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
    setIsAuthenticated(false);
  }


  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}