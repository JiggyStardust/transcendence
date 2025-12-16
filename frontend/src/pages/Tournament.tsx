// @ts-nocheck
import { Button } from "../components/Button.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from '../context/GameContext';
import { useUser } from "../context/UserContext";
import { useEffect } from "react";


const Match = ({game_number, player_1, player_2, active=true, onStartGame, winner}: {game_number: string, player_1: string, player_2:string, active?: boolean, onStartGame?: () => void, winner?: string | null}) => {
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
        {winner && <span className="ml-4 text-vintage-yellow">| Winner: {winner}</span>}
      </p>
    </div>
  )
}

export default function Tournament() {
  const navigate = useNavigate();
  const { gameState, setPlayers, setGameType, clearPlayers, setGameNumber } = useGame();
  const { users, loadMe } = useUser();

  const handleStartGame = (gameNumber: number,
                            p1name: string,
                            p2name: string,
                            p1id: number,
                            p2id: number) => {
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
  const isGame3Active = gameState.game1Winner && gameState.game2Winner;

  // Load the user context
  const me = loadMe();

  // Check for correct number of players in the case that user types /tournament directly
  const numberOfUsers = Object.values(users).length;
  if (numberOfUsers != 4) {
    navigate("/");
    return null;
  }

  const name1 = Object.values(users)[0]?.displayName || me?.displayName;
  const name2 = Object.values(users)[1]?.displayName || me?.displayName;
  const name3 = Object.values(users)[2]?.displayName || me?.displayName;
  const name4 = Object.values(users)[3]?.displayName || me?.displayName;
  const id1 = Object.values(users)[0]?.id || me?.id;
  const id2 = Object.values(users)[1]?.id || me?.id;
  const id3 = Object.values(users)[2]?.id || me?.id;
  const id4 = Object.values(users)[3]?.id || me?.id;
  const game1WinnerName = gameState.game1Winner?.displayName ?? null;
  const game2WinnerName = gameState.game2Winner?.displayName ?? null;
  const game3WinnerName = gameState.game3Winner?.displayName ?? null;


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
          onStartGame={() => handleStartGame(3, game1WinnerName!, game2WinnerName!)}
        />
      </div>
    </div>
  );
}