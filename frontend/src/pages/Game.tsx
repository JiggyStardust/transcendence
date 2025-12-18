import { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useGame } from '../context/GameContext';
import { useNavigate } from "react-router-dom";
import { useAppToast } from "../context/ToastContext";


const GameRedirect = () => {
  const navigate = useNavigate();
  const { setPlayers, setGameType, clearPlayers } = useGame();
  const { users, mainUser } = useUser();
  const { showToast } = useAppToast();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const startGame = async () => {
      
      // Get number of users logged in
      const numberOfUsers = Object.values(users).length;

      clearPlayers();
      var name1, name2, name3 = "";
      var id1, id2, id3 = 0;
      switch (numberOfUsers) {
        case 2:
          name1 = Object.values(users)[0]?.displayName || "Player1";
          name2 = Object.values(users)[1]?.displayName || "Player2";
          id1 = Object.values(users)[0]?.id || mainUser?.id;
          id2 = Object.values(users)[1]?.id || mainUser?.id;
          setGameType("regular");
          setPlayers([
            { id: id1!, displayName: name1 },
            { id: id2!, displayName: name2 }
          ])
          break;
        case 3:
          name1 = Object.values(users)[0]?.displayName || "Player1";
          name2 = Object.values(users)[1]?.displayName || "Player2";
          name3 = Object.values(users)[2]?.displayName || "Player3";
          id1 = Object.values(users)[0]?.id || mainUser?.id;
          id2 = Object.values(users)[1]?.id || mainUser?.id;
          id3 = Object.values(users)[2]?.id;
          setGameType("multiplayer");
          setPlayers([
            { id: id1!, displayName: name1 },
            { id: id2!, displayName: name2 },
            { id: id3!, displayName: name3 }
          ]);
          break;
        case 4:
          navigate("/tournament");
          return null;
        default:
          navigate("/login");
          showToast("At least 2 players must be logged in to play the game!", "error");
          return null;
      }
      navigate("/game");
    };

    startGame();
  }, [mainUser, users, clearPlayers, setGameType, setPlayers, navigate]);

  return null;
};

export default GameRedirect;
