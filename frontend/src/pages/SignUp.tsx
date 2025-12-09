import { useState } from "react";
import Input from "../components/Input";
import { Button} from "../components/Button";
import { PROXY_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function SignUp() {

	const [information, setInformation] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

// In this function we actually try to sign up

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
      console.log(data);
	  	setInformation("SignUp failed!");
      return;
    }
    console.log("SignUp was succesfull:", data);
		navigate("/login");
	}

// Here we check if username is already in use (saved to backend)
// This function is called onBlur = after the "username" field is left (finished typing)

	async function usernameInUse(name: string): Promise<boolean> {
	
		const url = PROXY_URL + "/users/check-username?username=" + name;
		console.log(url);

		try {
			const res = await fetch(url.toString(), {
			method: "GET",
			headers: { 
				"Content-Type": "application/json"
				}
			});
			
		console.log("fetch response status: ", res.status); // log HTTP status
			
		if (!res.ok){ 			// backend responded with an error status
			console.error("Username check failed:", res.status);
			return (false);
		}
		
		const data = await res.json();			
		console.log("data from check-username:", data);
		return !data.available; // return true if username is free
		} 
		
		catch (err) {			// network error, backend doesnt work / is offline or something
			console.error("Network error checking username:", err);
			return (false);
		}
	}

	function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
	  const username = e.target.value;
	  console.log(username);
	  setUsername(username);
	  if (username === "") {
			setInformation("Username can not be empty");
	  } else {
			setInformation("");
	  }
	}
 // "Password must be at least 8 chars, with upper, lower, digit, special character";
 // This should be displayed somewhere!

	function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
		const password = e.target.value;
		setPassword(password);
		console.log(password);
		if (password === "") {
			setInformation("Password can not be empty");
		} else {
			setInformation(""); 
		}
	}


// This function is to handle onBlur / triggering usernameInUse after username element loses focus
	async function handleUsernameBlur(e: React.FocusEvent<HTMLInputElement>) {
    
		const value = e.target.value;
		if (value === "") {
			setInformation("Username can not be empty!");
			return;
		}

    const taken = await usernameInUse(value);
    if (taken) {
			setInformation("Username already taken");
		 } else {
			setInformation(""); // clear message
		}
  }

	return (
		<div className="flex flex-col w-screen items-center justify-center min-h-screen transition-colors duration-300">
		  <p className="mt-10 text-lg text-center max-w-md">
 				This is where you SignUp!
	 	  </p>
			<form onSubmit={handleSignUp} className="px-4 py-8 border border-white rounded-lg ">
				<p>
					{information && (
					<div className="flex items-center gap-2 text-red-500 font-bold mb-2">
						<FiAlertCircle className="text-xl" />
						<span>{information}</span>
					</div>
				)}
				</p>
				<Input 
			  	id="username"
			  	label="Username:" 
			  	type="text" 
			  	value={username} 
			  	onChange={handleUsernameChange}
			  	onBlur={handleUsernameBlur}
					focusTooltip={
						<div>
  					<p className="font-semibold mb-1">Username requirements:</p>
  					<ul className="list-disc list-inside space-y-1">
   						<li>At least 3 characters</li>
    					<li>Unique (not taken by other user)</li>
  					</ul>
					</div>
					}
			  />

				<Input
			  	id="password" 
				  label="Password:" 
			 		type="password" 
			 		value={password} 
			 		onChange={handlePasswordChange}
					focusTooltip={
						<div>
  					<p className="font-semibold mb-1">Password requirements:</p>
  					<ul className="list-disc list-inside space-y-1">
   						<li>At least 8 characters</li>
    					<li>One uppercase letter</li>
    					<li>One lowercase letter</li>
    					<li>One digit</li>
    					<li>One special character</li>
  					</ul>
					</div>
					}
				/>
				<Button>Sign up</Button>
			</form>
		</div>
	);
}