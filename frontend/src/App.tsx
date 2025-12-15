// @ts-nocheck

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from './context/GameContext';
import Landing from "./pages/Landing.tsx";
import SignUp from "./pages/SignUp.tsx";
import Testing from "./pages/Testing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Game from "./pages/Game.tsx";
import BabylonGame from "./components/BabylonGame.tsx";
import Tournament from "./pages/Tournament.tsx";
import Login from "./pages/Login.tsx";
import ProfileSettings from "./pages/ProfileSettings";
import Players from "./pages/Players.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
    <div>
      <Router>
        <GameProvider>
				<NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
	    	  <Route path="/testing" element={<Testing />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game" element={<BabylonGame />} />
          <Route path="/profile_settings" element={<ProfileSettings />} />
          <Route path="/players" element={<Players />} />
        </Routes>
        </GameProvider>
      </Router>
    </div>
  );
}

export default App;