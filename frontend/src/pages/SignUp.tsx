import { ThemeToggle } from "../components/ThemeToggle";
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

	// async function usernameInUse(name: string): Promise<boolean> {
		
	// try {
	//   //Backend API call placeholder here, although the path doesn't exist yet:
	//   const res = await fetch(PROXY_URL + "/check-username", {
	//   method: "POST",
	//   headers: { 
	// 	"Content-Type": "application/json"
	//   },
	//   body: JSON.stringify({username: name})
	// });
		
	// if (!res.ok){ // backend responded but with and error status
	//   console.error("Username check failed:", res.status);
	//   return (false);
	// }
	
	// const data = await res.json();			

	// // We expect backend to return something like:
    // // { exists: true } or { exists: false }
    // return data.exists === true; // we return false or true based on backend reply
	// } catch (err) {
	// 	// network error, backend doesnt work / offline or something
	// 	console.error("Network error checking username:", err);
    // 	return (false);
	//   }
	// }

	function handleUsernameChange(e) {
		const username = e.target.value;
		console.log(username);
		setUsername(username);
		if (username === "") {
			setInformation("Username can not be empty");
		}
		// else if ( await usernameInUse(username)) {
		// 	setInformation("Username already taken");
		// } else {
			setInformation("");
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
		<div className="page-bg flex flex-col w-screen items-center justify-center min-h-screen text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
		 <Logo size={7}/>
		  <p className="mt-10 text-lg text-center max-w-md">
 			This is where you SignUp!
	 	  </p>
			<form action={handleSignUp} className="px-4 py-8 border border-white rounded-lg ">
				<p>{information}</p>
				<Input id="username" label="Username:" type="text" value={username} onChange={handleUsernameChange}/>
				<Input id="password" label="Password:" type="password" value={password} onChange={handlePasswordChange}/>
				<button type="submit">Sign up</button>
			</form>
			<ThemeToggle />
		</div>
	)
}