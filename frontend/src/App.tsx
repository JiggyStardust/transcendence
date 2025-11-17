import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Testing from "./pages/Testing";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
    <div>
      <Router>
				<NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
				  <Route path="/testing" element={<Testing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
