// @ts-nocheck
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useGame } from '../context/GameContext';
import { useNavigate } from "react-router-dom";

const GameRedirect = () => {
  const navigate = useNavigate();
  const { setPlayers, setGameType, clearPlayers } = useGame();
  const { users, loadMe } = useUser();

  useEffect(() => {
    const startGame = async () => {
      // Load the main user first
      const me = await loadMe();
      
      // Get number of users logged in
      const numberOfUsers = Object.values(users).length;
      console.log("Number of users:", numberOfUsers);

      clearPlayers();
      var user1 = "";
      var user2 = "";
      var user3 = "";
      switch (numberOfUsers) {
        case 2:
          console.log("case 2");
          user1 = Object.values(users)[0]?.displayName || me?.displayName;
          user2 = Object.values(users)[1]?.displayName || me?.displayName;
          setGameType("regular");
          setPlayers([
            { id: "1", displayName: user1 },
            { id: "2", displayName: user2 }
          ]);
          break;
        case 3:
          console.log("case 3");
          user1 = Object.values(users)[0]?.displayName || me?.displayName;
          user2 = Object.values(users)[1]?.displayName || me?.displayName;
          user3 = Object.values(users)[2]?.displayName || me?.displayName;
          setGameType("multiplayer");
          setPlayers([
            { id: "1", displayName: user1 },
            { id: "2", displayName: user2 },
            { id: "3", displayName: user3 }
          ]);
          break;
        case 4:
          console.log("case 4");
          navigate("/tournament");
          return null;
        default:
          console.log("case default");
          navigate("/login");
          return null;
      }
      navigate("/game");
    };

    startGame();
  }, [loadMe, users, clearPlayers, setGameType, setPlayers, navigate]);

  return null;
};

export default GameRedirect;
