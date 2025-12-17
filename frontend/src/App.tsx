import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Testing from "./pages/Testing";
import Login from "./pages/Login";
import Settings from "./pages/Settings.tsx";
import Game from "./pages/Game";
import Players from "./pages/Players.tsx";
import NavBar from "./components/NavBar.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import Profile from "./pages/Profile";

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
          <Route path="/settings" element={<Settings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route element={<PrivateRoute />}>
            <Route path="/players" element={<Players />} /> 
          </Route>
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;