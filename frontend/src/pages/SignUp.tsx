import { useState, useMemo } from "react";
import Input from "../components/Input"

export default function SignUp() {

	function handleSignUp() {
		//API call here
		console.log("Sign up API called");			//TEST
	}

	return (
		<div>
			<form action={handleSignUp}>
				<Input label="Username:" id="username" type="text" />
				<Input id="password" label="Password:" type="text"/>
				<button type="submit">Sign up</button>
			</form>
		</div>
	)
}