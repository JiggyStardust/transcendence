import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import  from "./pages/";
import SignUp from "./pages/SignUp";
import Testing from "./pages/Testing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
	    	  <Route path="/testing" element={<Testing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
