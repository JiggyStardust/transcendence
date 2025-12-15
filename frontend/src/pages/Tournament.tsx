// @ts-nocheck
import { Button } from "../components/Button.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from '../context/GameContext';

const Match = ({game_number, player_1, player_2, active=true, onStartGame, winner}: {game_number: string, player_1: string, player_2:string, active?: boolean, onStartGame?: () => void, winner?: string | null}) => {
  return (
    <div className="flex justify-center gap-7">
      <Button 
        variant="primary" 
        size="lg" 
        disabled={!active || !!winner}
        onClick={onStartGame}
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

  const handleStartGame = (gameNumber: number, player1: string, player2: string) => {
    clearPlayers();
    setGameType("tournament");
    setGameNumber(gameNumber);
    setPlayers([
      { id: "1", displayName: player1 },
      { id: "2", displayName: player2 }
    ]);

    setTimeout(() => {
      navigate("/game");
    }, 0);
  };

  // Check if game 3 should be active (both game 1 and 2 are complete)
  const isGame3Active = gameState.game1Winner && gameState.game2Winner;

  return (
    <div className="flex justify-center flex-col items-center gap-10">
      <h1 className="mt-4 font-press text-7xl text-vintage-red dark:text-vintage-yellow [word-spacing:-30px] tracking-[-0.1em]">Tournament</h1>
      <div className="flex flex-col items-start gap-4">
        <Match
          game_number="Game 1"
          player_1={"PlayerA"}
          player_2={"PlayerB"}
          winner={gameState.game1Winner}
          onStartGame={() => handleStartGame(1, "PlayerA", "PlayerB")}
        />
        <Match
          game_number="Game 2"
          player_1={"PlayerC"}
          player_2={"PlayerD"}
          winner={gameState.game2Winner}
          onStartGame={() => handleStartGame(2, "PlayerC", "PlayerD")}
        />
        <Match
          game_number="Game 3"
          player_1={gameState.game1Winner || "Winner of Game 1"}
          player_2={gameState.game2Winner || "Winner of Game 2"}
          winner={gameState.game3Winner}
          active={isGame3Active}
          onStartGame={() => handleStartGame(3, gameState.game1Winner!, gameState.game2Winner!)}
        />
      </div>
    </div>
  )
}