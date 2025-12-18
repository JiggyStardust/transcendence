import { useState } from "react";
import Input from "../components/Input";
import { Button} from "../components/Button";
import { PROXY_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { passwordRequirements } from "../constants/passwordRequirements";
import { useAppToast } from "../context/ToastContext";
import { type Status } from "../types/toastTypes";

const usernameRequirementsList = () => {
	return (
		<div>
			<p className="font-semibold mb-1">Username requirements:</p>
			<ul className="list-disc list-inside space-y-1">
				<li>At least 3 characters</li>
				<li>Unique (not taken by other user)</li>
			</ul>
		</div>
	)
}

const passwordRequirementsList = () => {
	return (
		<div>
			<p className="font-semibold mb-1">Password requirements:</p>
			<ul className="list-disc list-inside space-y-1">
				{passwordRequirements.map((req) => (
				  <li key={req}>{req}</li>
				))}
			</ul>
		</div>
	)
}

export default function SignUp() {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameStatus, setUsernameStatus] = useState<Status | null>(null);
	const [passwordStatus, setPasswordStatus] = useState<Status | null>(null);

	const navigate = useNavigate();
	const { showToast } = useAppToast();

	async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
	
		e.preventDefault();

    const res = await fetch(PROXY_URL + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username,password})
    });

    const data = await res.json();

    if (!res.ok) {
      // console.log(data);
	  	showToast("Error: " + data.error, "error");
      return;
    }
    // console.log("SignUp was succesfull:", data);
		showToast("You have successfully created an account, you still need to log in to access the game", "success");
		navigate("/login");
	}

// Here we check if username is already in use (saved to backend)
// This function is called onBlur = after the "username" field is left (finished typing)

	async function usernameInUse(name: string) {
	
		const url = PROXY_URL + "/users/check-username?username=" + name;
		// console.log(url);

		try {
			const res = await fetch(url.toString(), {
			method: "GET",
			headers: { 
				"Content-Type": "application/json"
				}
			});
			
			// console.log("fetch response status: ", res.status); // log HTTP status

			const data = await res.json();
				
			if (!res.ok){ 			// backend responded with an error status
				// console.error("Username check failed:", res.status);
				showToast("Something went wrong with username check, try again later.", "error");
			}
			return (data);
		} 
		catch (err) {			// network error, backend doesnt work / is offline or something
			// console.error("Network error checking username:", err);
			showToast("Something went wrong with username check, try again later.", "error");
			return (null);
		}
	}

	function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
	  const username = e.target.value;
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
		if (password === "") {
			setPasswordStatus({type: "warning", message: "Password can not be empty"});
		} else {
			setPasswordStatus(null);
		}
	}


// This function is to handle onBlur / triggering usernameInUse after username element loses focus
	async function handleUsernameBlur(e: React.FocusEvent<HTMLInputElement>) {
    
		const value = e.target.value;
		if (value === "") {
			setUsernameStatus({type: "warning", message: "Username can not be empty!"});
			return;
		}
    const data = await usernameInUse(value);
		// console.log("data from check-username:", data);
		if (!data.available) {
			setUsernameStatus({type: "error", message: "Username is already in use, choose a unique one."})
		}
		else {
			setUsernameStatus({type: "ok", message: "Looks good!"});
		}
  }

	return (
		<div className="flex flex-col items-center justify-center gap-4 mt-36">
			<h2 className="font-tomorrow font-bold text-3xl text-vintage-red dark:text-vintage-yellow ">Please sign up!</h2>
			<div className="flex flex-col items-center bg-stone-700/50 dark:bg-stone-500 rounded-3xl p-8 gap-4">
				<form onSubmit={handleSignUp} className="flex flex-col items-center gap-4">
					<Input 
				  	id="username"
				  	label="Username:" 
				  	type="text" 
				  	value={username} 
						status={usernameStatus || undefined}
				  	onChange={handleUsernameChange}
				  	onBlur={handleUsernameBlur}
						focusTooltip={usernameRequirementsList()}/>
					<Input
				  	id="password" 
					  label="Password:" 
				 		type="password" 
				 		value={password}
						status={passwordStatus || undefined}
				 		onChange={handlePasswordChange}
						focusTooltip={passwordRequirementsList()}/>
					<Button
						disabled={usernameStatus === null || password === "" || usernameStatus.type !== "ok" }>
							Sign up
					</Button>
				</form>
			</div>
		</div>
	);
}