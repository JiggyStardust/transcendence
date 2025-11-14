import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Testing from "./pages/Testing";
import ProfileSettings from "./pages/ProfileSettings";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
		      <Route path="/testing" element={<Testing />} />
          <Route path="/profile_settings" element={<ProfileSettings />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
