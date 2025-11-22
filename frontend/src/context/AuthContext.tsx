import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokens: { access: string; refresh: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  function login(tokens: { access: string; refresh: string }) {
    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
  }

  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, isAuthenticated }}
    >
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