import { useState, useMemo } from "react";
import Input from "../components/Input"

export default function SignUp() {
	
	const [information, setInformation] = useState("");

	function handleSignUp({username, password: string}) {
		if (username )
		//API call here
		console.log("Sign up API called");			//TEST
		setInformation("username taken");
	}


	return (
		<div>
			<form action={handleSignUp} className="px-4 py-8 border border-white ">
				<p>{information}</p>
				<Input label="Username:" id="username" type="text" />
				<Input id="password" label="Password:" type="text"/>
				<button type="submit">Sign up</button>
			</form>
		</div>
	)
}