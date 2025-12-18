import { useState } from "react";
import { useEffect } from "react";
import { PROXY_URL } from "../constants";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppToast } from "../context/ToastContext";
import { type Status } from "../types/toastTypes";

interface TwoFAModalProps {
  twoFACode: string;
  twoFACodeStatus: Status | null;
  handleTwoFAChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateTwoFA: () => Promise<void>;
  onClose: () => void;
}

const TwoFAModal = ({ twoFACode, onClose, twoFACodeStatus, handleTwoFAChange, validateTwoFA}: TwoFAModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
      <div className="bg-light-bg dark:bg-dark-bg p-8 rounded-xl shadow-xl max-w-sm w-full text-center flex flex-col items-center gap-2">
        <h3 className="text-md font-semibold mb-4">Please write the code from your Two Factor Authentication app</h3>
        <div className="flex flex-col gap-4 mb-4">
          <Input
            id="twoFactorAuthToken"
            label="Two Factor Authentication code"
            value={twoFACode}
            autofocus={true}
            status={twoFACodeStatus || undefined}
            tooltip="Open the app that you used for two factor authentication and input the code from there"
            onChange={handleTwoFAChange}/>
        </div>
        <div className="flex gap-39">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" disabled={twoFACode === ""} onClick={validateTwoFA}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<Status | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<Status | null>(null);
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFACodeStatus, setTwoFACodeStatus] = useState<Status | null>(null);

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

    // console.log("handle login: " + data.twoFARequired);

    if (!res.ok) {
      showToast("Login failed: " + data.error, "error");
      setUsername("");
      setPassword("");
      return;
    }
    if (data.twoFARequired) {
      // console.log("Two factor required");
      setTwoFAModalOpen(true);
    } else {
      login();
      navigate("/dashboard");
    }
  }

  const handleTwoFAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value
    setTwoFACode(code);
    if (code === "") {
      setTwoFACodeStatus({type: "error", message: "Can not be empty"});
    } else {
      setTwoFACodeStatus(null);
    }
  }

  async function validateTwoFA () {

    // console.log("Validate clicked");
    const token = twoFACode;

    const res = await fetch(PROXY_URL + "/login-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, token })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast("Validation failed: " + data.error, "error");
      return;
    }
    login();
    navigate("/players");
  }

  function onClose() {
    setTwoFAModalOpen(false);
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
	  const username = e.target.value;
	  // console.log(username);
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
		// console.log(password);
		if (password === "") {
			setPasswordStatus({type: "warning", message: "Password can not be empty"});
		} else {
			setPasswordStatus(null);
		}
	}

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-36">
			<h2 className="font-tomorrow font-bold text-3xl text-vintage-red dark:text-vintage-yellow ">Login to play!</h2>
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
        {twoFAModalOpen && (
          <TwoFAModal twoFACode={twoFACode} onClose={onClose} twoFACodeStatus={twoFACodeStatus} handleTwoFAChange={handleTwoFAChange} validateTwoFA={validateTwoFA} />
        )}
      </div>
    </div>
  );
}
