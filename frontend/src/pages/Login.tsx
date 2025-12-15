import { useState } from "react";
import { useEffect } from "react";
import { PROXY_URL } from "../constants";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppToast } from "../context/ToastContext";
import { type Status } from "../types/types";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<Status | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<Status | null>(null);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useAppToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/players");
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(PROXY_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast("Login failed: " + data.error, "error");
      setUsername("");
      setPassword("");
      return;
    }
    login();
    navigate("/dashboard");
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
	  const username = e.target.value;
	  console.log(username);
	  setUsername(username);
	  if (username === "") {
			setUsernameStatus({type: "warning", message: "Username can not be empty."});
	  } else {
			setUsernameStatus(null);
	  }
	}

 	function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
		const password = e.target.value;
		setPassword(password);
		console.log(password);
		if (password === "") {
			setPasswordStatus({type: "warning", message: "Password can not be empty"});
		} else {
			setPasswordStatus(null);
		}
	}

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-36">
			<h2 className="font-tomorrow font-bold text-3xl text-stone-800 dark:text-vintage-yellow ">Login to play!</h2>
			<div className="flex flex-col items-center bg-stone-700/50 dark:bg-stone-500 rounded-3xl p-8 gap-4">
        <form className="flex flex-col items-center gap-4" onSubmit={handleLogin}>
          <Input
            id="username"
            label="Username:"
            type="text"
            value={username}
            status={usernameStatus || undefined}
            onChange={handleUsernameChange}
          />
          <Input
            id="password"
            label="Password:"
            type="password"
            value={password}
            status={passwordStatus || undefined}
            onChange={handlePasswordChange}
          />
          <Button disabled={ username === "" || password === "" }>Login</Button>
        </form>
      </div>
    </div>
  );
}
