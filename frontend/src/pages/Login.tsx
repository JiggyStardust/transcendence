import { useState } from "react";
import { useEffect } from "react";
import { PROXY_URL } from "../constants";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [information, setInformation] = useState<string>(""); // adding <string> is optional
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/sideplayer-login"); // or "/dashboard", whichever you want
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // to prevent browsers default behaviour with forms (reloading the page), optional?

    const res = await fetch(PROXY_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include" // for the cookies
    });

    // const data = await res.json();

    if (!res.ok) {
      setInformation("Login failed!");
      setUsername("");
      setPassword("");
      return;
    }

    login();

    navigate("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen">
      <p className="mt-4 text-lg text-center max-w-md">This is where you Login!</p>
      <form
        onSubmit={handleLogin}
        className="px-4 py-8 border border-white rounded-lg"
      >
        <p>{information}</p>

        <Input
          id="username"
          label="Username:"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          id="password"
          label="Password:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">Login</Button>
      </form>

    </div>
  );
}