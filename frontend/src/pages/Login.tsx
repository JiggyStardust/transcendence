import { ThemeToggle } from "../components/ThemeToggle";
import { useState } from "react";
import { PROXY_URL } from "../constants";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [information, setInformation] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(PROXY_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setInformation("Login failed!");
      setUsername("");
      setPassword("");
      return;
    }

    login({
      access: data.accessToken,
      refresh: data.refreshToken
    });

    navigate("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen">
      <h1 className="font-[Honk] text-[120px]">Ping of Pongs</h1>
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

      <ThemeToggle />
    </div>
  );
}