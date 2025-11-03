import { ThemeToggle } from "../components/ThemeToggle";
import { Logo } from "../components/Logo"
import { useState } from "react";
import Input from "../components/Input";
import { Button} from "../components/Button";

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
		<div className="flex flex-col w-screen items-center justify-center min-h-screen text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
	style={{
        background: `linear-gradient(to bottom, var(--bg-start) 0%, var(--bg-end) var(--bg-shift))`,
      }}>
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
//   return (
{/* <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
	style={{
        background: `linear-gradient(to bottom, var(--bg-start) 0%, var(--bg-end) var(--bg-shift))`,
      }}> */}
// 	  <Logo />
// 	  <ThemeToggle />
// 	  <p className="mt-4 text-lg text-center max-w-md">
// 		This is where you SignUp!
// 	  </p>
// 	</div>
//   );
// }