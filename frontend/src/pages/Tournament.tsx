// @ts-nocheck
import { Button } from "../components/Button.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from '../context/GameContext';

const Match = ({game_number, player_1, player_2, active=true, onStartGame}: {game_number: string, player_1: string, player_2:string, active?: boolean, onStartGame?: () => void}) => {
  return (
    <div className="flex justify-center gap-7">
      <Button 
        variant="primary" 
        size="lg" 
        disabled={!active}
        onClick={onStartGame}
      >
        {game_number}
      </Button>
      <p className="text-3xl">{player_1} vs. {player_2}</p>
    </div>
  )
}

export default function Tournament() {
  const navigate = useNavigate();
  const { gameState, setPlayers, setGameType } = useGame();

  const handleStartGame = (player1: string, player2: string) => {
    setGameType("tournament");
    setPlayers([
      { id: "1", displayName: player1 },
      { id: "2", displayName: player2 }
    ]);

    setTimeout(() => {
      navigate("/game");
    }, 0);
  };

  return (
    <div className="flex justify-center flex-col items-center gap-10">
      <h1 className="mt-4 font-press text-7xl text-vintage-red dark:text-vintage-yellow [word-spacing:-30px] tracking-[-0.1em]">Tournament</h1>
      <div className="flex flex-col items-start gap-4">
        <Match
          game_number="Game 1"
          player_1={"PlayerA"}
          player_2={"PlayerB"}
          onStartGame={() => handleStartGame("PlayerA", "PlayerB")}
        />
        <Match
          game_number="Game 2"
          player_1={"PlayerC"}
          player_2={"PlayerD"}
          onStartGame={() => handleStartGame("PlayerC", "PlayerD")}
        />
        <Match
          game_number="Game 3"
          player_1={"Winner of Game 1"}
          player_2={"Winner of Game 2"}
          active={false}
        />
      </div>
    </div>
  )
}