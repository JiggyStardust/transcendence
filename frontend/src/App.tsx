import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import SignUp from "./pages/SignUp.tsx";
import Testing from "./pages/Testing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Game from "./pages/Game.tsx";
import Tournament from "./pages/Tournament.tsx";
import Login from "./pages/Login.tsx";
import SideplayerLogin from "./pages/SideplayerLogin.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
    <div>
      <Router>
				<NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sideplayer-login" element={<SideplayerLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
	    	  <Route path="/testing" element={<Testing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;