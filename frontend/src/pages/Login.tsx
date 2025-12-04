import { useState } from "react";
import { PROXY_URL } from "../constants";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";


export default function Login() {

	const [information, setInformation] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	async function handleLogin() {

		const res = await fetch(PROXY_URL + "/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({username,password})
		});

		const data = await res.json();

		if (!res.ok) {
			console.log(data);
			setInformation("Login failed!");
			return;
		}
		console.log("Login was succesfull: ", data);
		// Now that we've logged in, we probably also want to fetch user data (Display name, scores...) from backend to show statistics on leaderboard etc.
		// and save them to context.
		navigate("/profile_settings");
	}

	function handleUsernameChange(e) {
	  const username = e.target.value;
	  console.log(username);
	  setUsername(username);
	  if (username === "") {
		setInformation("Username can not be empty");
	  } else {
		setInformation("");
	  }
	}

	function handlePasswordChange(e) {
		const password = e.target.value;
		setPassword(password);
		console.log(password);
		if (password === "") {
			setInformation("Password can not be empty");
		} else {
			setInformation("");
		}
	}

  return (
		<div className="flex flex-col items-center justify-center min-h-screen w-screen">
		  <p className="mt-4 text-lg text-center max-w-md">
				This is where you Login!
		  </p>
	  	<form action={handleLogin} className="px-4 py-8 border border-white rounded-lg ">
				<p>{information}</p>
				<Input 
				  id="username"
				  label="Username:" 
				  type="text" 
				  value={username} 
				  onChange={handleUsernameChange}
				  />
				<Input
				  id="password" 
				  label="Password:" 
				  type="password" 
				  value={password} 
				  onChange={handlePasswordChange}
				  />
					<Button>Login</Button>
				</form>
		</div>
  	);
};