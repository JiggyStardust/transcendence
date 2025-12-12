import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Testing from "./pages/Testing";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import Game from "./pages/Game";
import Players from "./pages/Players.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
    <div>
      <Router>
				<NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
		      <Route path="/testing" element={<Testing />} />
          <Route path="/profile_settings" element={<ProfileSettings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;