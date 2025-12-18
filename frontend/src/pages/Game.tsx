
import { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useGame } from '../context/GameContext';
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../context/ToastContext";


const GameRedirect = () => {
  const navigate = useNavigate();
  const { setPlayers, setGameType, clearPlayers } = useGame();
  const { users, loadMe } = useUser();
  const { showToast } = useAppToast();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const startGame = async () => {

      // Load the main user first
      const me = await loadMe();
      
      // Get number of users logged in
      const numberOfUsers = Object.values(users).length;

      clearPlayers();
      var name1, name2, name3 = "";
      var id1, id2, id3 = 0;
      switch (numberOfUsers) {
        case 2:
          name1 = Object.values(users)[0]?.displayName || me?.displayName;
          name2 = Object.values(users)[1]?.displayName || me?.displayName;
          id1 = Object.values(users)[0]?.id || me?.id;
          id2 = Object.values(users)[1]?.id || me?.id;
          setGameType("regular");
          setPlayers([
            { id: id1, displayName: name1 },
            { id: id2, displayName: name2 }
          ])
          break;
        case 3:
          name1 = Object.values(users)[0]?.displayName || me?.displayName;
          name2 = Object.values(users)[1]?.displayName || me?.displayName;
          name3 = Object.values(users)[2]?.displayName || me?.displayName;
          id1 = Object.values(users)[0]?.id || me?.id;
          id2 = Object.values(users)[1]?.id || me?.id;
          id3 = Object.values(users)[2]?.id || me?.id;
          setGameType("multiplayer");
          setPlayers([
            { id: id1, displayName: name1 },
            { id: id2, displayName: name2 },
            { id: id3, displayName: name3 }
          ]);
          break;
        case 4:
          navigate("/tournament");
          return null;
        default:
          navigate("/login");
          showToast("At least 2 players must be logged in to play the game!");
          return null;
      }
      navigate("/game");
    };

    startGame();
  }, [loadMe, users, clearPlayers, setGameType, setPlayers, navigate]);

  return null;
};

export default GameRedirect;
