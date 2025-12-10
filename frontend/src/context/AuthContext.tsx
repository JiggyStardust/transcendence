import { createContext, useContext, useState, ReactNode } from "react";

// below we define what values or functions are accessed with AuthContext

interface AuthContextType {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null); // is first initialized with null

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  function login() {
    // cookies are set in the backend, no storing tokens anymore
    setIsAuthenticated(true);
  }

  function logout() {
    // no logout endpoint in the backend yet, we just set as false in the front (cookies should be deleted in the back)
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