import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from './context/GameContext';
import Landing from "./pages/Landing.tsx";
import SignUp from "./pages/SignUp.tsx";
import Testing from "./pages/Testing.tsx";
import Login from "./pages/Login.tsx";
import Settings from "./pages/Settings.tsx";
import GameRedirect from "./pages/Game.tsx";
import Players from "./pages/Players.tsx";
import NavBar from "./components/NavBar.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";
import Tournament from "./pages/Tournament.tsx";
import BabylonGame from "./components/BabylonGame.tsx";


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
         <Route element={<PrivateRoute />}>
           <Route path="/players" element={<Players />} />
         </Route>
         <Route path="*" element={<Landing />} />
         <Route path="/tournament" element={<GameProvider> <Tournament /> </GameProvider>} />
         <Route path="/game" element={<GameProvider> <BabylonGame /> </GameProvider>} />
         <Route path="/gameRedirect" element={<GameProvider> <GameRedirect /> </GameProvider>} />
       </Routes>
     </Router>
   </div>
 );
}


export default App;



