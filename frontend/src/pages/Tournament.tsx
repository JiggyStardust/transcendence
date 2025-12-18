import { Button } from "../components/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from '../context/GameContext';
import { useUser } from "../context/UserContext";

interface User {
  id: number;
  displayName: string;
}

interface MatchProps {
  game_number: string;
  player_1: string;
  player_2: string;
  active?: boolean;
  onStartGame?: () => void;
  winner?: string | null;
}

const Match = ({game_number, player_1, player_2, active=true, onStartGame, winner}: MatchProps) => {
  return (
    <div className="flex justify-center gap-7">
      <Button 
        variant="primary" 
        size="lg" 
        disabled={!active || !!winner}
        onClick={() => {
          if (active && !winner) {
            onStartGame?.()
          }
        }}
      >
        {game_number}
      </Button>
      <p className="text-3xl">
        {player_1} vs. {player_2}
        {winner && <span className="ml-4">| Winner: {winner}</span>}
      </p>
    </div>
  )
}

export default function Tournament() {
  const navigate = useNavigate();
  const { gameState, setPlayers, setGameType, clearPlayers, setGameNumber } = useGame();
  const { users, User: user } = useUser();
  const [me, setMe] = useState<User | null>(null);

  // Load user data once on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setMe(user);
      }
    };
    loadUserData();
  }, [user]);

  const handleStartGame = (gameNumber: number,
                            p1name: string,
                            p2name: string,
                            p1id?: number,
                            p2id?: number) => {
    clearPlayers();
    setGameType("tournament");
    setGameNumber(gameNumber);
    setPlayers([
      { id: p1id, displayName: p1name },
      { id: p2id, displayName: p2name }
    ]);

    setTimeout(() => {
      navigate("/game");
    }, 0);
  };

  // Check if game 3 should be active (both game 1 and 2 are complete)
  let isGame3Active = false;
  if (gameState.game1Winner && gameState.game2Winner)
    isGame3Active = true;
  // Check for correct number of players
  const numberOfUsers = Object.values(users).length;
  if (numberOfUsers != 4) {
    navigate("/");
    return null;
  }

  const name1 = (Object.values(users)[0] as User)?.displayName || "Player1";
  const name2 = (Object.values(users)[1] as User)?.displayName || "Player2";
  const name3 = (Object.values(users)[2] as User)?.displayName || "Player3";
  const name4 = (Object.values(users)[3] as User)?.displayName || "Player4";
  const id1 = (Object.values(users)[0] as User)?.id || me?.id;
  const id2 = (Object.values(users)[1] as User)?.id || me?.id;
  const id3 = (Object.values(users)[2] as User)?.id || me?.id;
  const id4 = (Object.values(users)[3] as User)?.id || me?.id;
  const game1WinnerName = gameState.game1Winner ?? null;
  const game2WinnerName = gameState.game2Winner ?? null;
  const game3WinnerName = gameState.game3Winner ?? null;

  // Get winner IDs for Game 3
  const game1WinnerId = game1WinnerName === name1 ? id1 : game1WinnerName === name2 ? id2 : undefined;
  const game2WinnerId = game2WinnerName === name3 ? id3 : game2WinnerName === name4 ? id4 : undefined;

  // Warn user on page refresh or tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Refreshing will reset tournament data!";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex justify-center flex-col items-center gap-10">
      <h1 className="mt-4 font-press text-7xl text-vintage-red dark:text-vintage-yellow [word-spacing:-30px] tracking-[-0.1em]">Tournament</h1>
      <div className="flex flex-col items-start gap-4">
        <Match
          game_number="Game 1"
          player_1={name1}
          player_2={name2}
          winner={game1WinnerName}
          onStartGame={() => handleStartGame(1, name1, name2, id1, id2)}
        />
        <Match
          game_number="Game 2"
          player_1={name3}
          player_2={name4}
          winner={game2WinnerName}
          onStartGame={() => handleStartGame(2, name3, name4, id3, id4)}
        />
        <Match
          game_number="Game 3"
          player_1={game1WinnerName || "Winner of Game 1"}
          player_2={game2WinnerName || "Winner of Game 2"}
          winner={game3WinnerName}
          active={isGame3Active}
          onStartGame={() => handleStartGame(3, game1WinnerName!, game2WinnerName!, game1WinnerId, game2WinnerId)}
        />
      </div>
    </div>
  );
}
