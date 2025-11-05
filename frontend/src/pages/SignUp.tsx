import { useState } from "react";
import Input from "../components/Input";
import { Button} from "../components/Button";
import { PROXY_URL } from "../constants"

export default function SignUp() {

	const [information, setInformation] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function handleSignUp() {
    //API call here
    const res = await fetch(PROXY_URL + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username,password})
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      return;
    }

    setInformation("Wow!!!!");

    console.log("Sign up API called");            //TEST
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
		<div>
			<form action={handleSignUp} className="px-4 py-8 border border-white rounded-lg ">
				<p>{information}</p>
				<Input id="username" label="Username:" type="text" value={username} onChange={handleUsernameChange}/>
				<Input id="password" label="Password:" type="password" value={password} onChange={handlePasswordChange}/>
				<button type="submit">Sign up</button>
			</form>
		</div>
	)
}
