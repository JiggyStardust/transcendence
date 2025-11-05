import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
	<Router>
		<div className="flex-col justify-center">
			<NavBar />
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />
			</Routes>
		</div>
	</Router>
  );
}

export default App;
