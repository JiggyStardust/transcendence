import { useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/Button";

export default function SignUp() {
	
	const [information, setInformation] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleSignUp() {
		//API call here
		console.log("Sign up API called");			//TEST
	}

	function usernameInUse() {
		//API call here
		return (true);			//Based on reply
	}

	function handleUsernameChange(e) {
		const username = e.target.value;
		console.log(username);
		setUsername(username);
		if (username === "") {
			setInformation("Username can not be empty");
		}
		else if (usernameInUse()) {
			setInformation("Username already taken");
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
		<div className="flex justify-center pt-16 bg-gray-200 dark:bg-gray-800 h-screen">
			<form action={handleSignUp} className="flex flex-col items-center px-4 py-8 border max-h-64 dark:border-white border-black rounded-lg">
				<p>{information}</p>
				<Input id="username" label="Username:" type="text" value={username} onChange={handleUsernameChange}/>
				<Input id="password" label="Password:" type="password" value={password} onChange={handlePasswordChange}/>
				<button type="submit">Sign up</button>
			</form>
		</div>
	)
}