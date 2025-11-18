import { ThemeToggle } from "../components/ThemeToggle";
import { useState } from "react";
import Input from "../components/Input";
import { Button} from "../components/Button";
import { PROXY_URL } from "../constants";
import { useNavigate } from "react-router-dom";

export default function SignUp() {

	const [information, setInformation] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

// In this function we actually try to sign up

	async function handleSignUp() {

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
	
	} catch (err) {			// network error, backend doesnt work / is offline or something
	  console.error("Network error checking username:", err);
      return (false);
	  }
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


// This function is to handle onBlur / triggering usernameInUse after username element loses focus
	async function handleUsernameBlur(e: React.FocusEvent<HTMLInputElement>) {
    	const value = e.target.value;
      	if (value !== "") {
          const taken = await usernameInUse(value);
          if (taken) {
			setInformation("Username already taken");
		} else {
			setInformation(""); // clear message
		}
     }
  }

	return (
		<div className="flex flex-col w-screen items-center justify-center min-h-screen transition-colors duration-300">
		<h1 className="font-[Honk] text-[120px]">Ping of Pongs</h1>
		  <p className="mt-10 text-lg text-center max-w-md">
 			This is where you SignUp!
	 	  </p>
			<form action={handleSignUp} className="px-4 py-8 border border-white rounded-lg ">
				<p>{information}</p>
				<Input 
				  id="username"
				  label="Username:" 
				  type="text" 
				  value={username} 
				  onChange={handleUsernameChange}
				  onBlur={handleUsernameBlur}
				  />

				<Input
				  id="password" 
				  label="Password:" 
				  type="password" 
				  value={password} 
				  onChange={handlePasswordChange}
				  />

				<Button type="submit">Sign up</Button>
			</form>

			<ThemeToggle />
		</div>
	);
}