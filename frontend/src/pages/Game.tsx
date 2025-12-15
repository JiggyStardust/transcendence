// @ts-nocheck
import { useEffect } from "react";
import { useGame } from '../context/GameContext';
import { useNavigate } from "react-router-dom";

const GameRedirect = () => {
  const navigate = useNavigate();
  const { gameState, setPlayers, setGameType, clearPlayers, setGameNumber } = useGame();
  const handleStartGame = (gameType: string, player1: string, player2: string) => {
    clearPlayers();
    setGameType(gameType);
    setPlayers([
      { id: "1", displayName: player1 },
      { id: "2", displayName: player2 }
    ]);

    setTimeout(() => {
      navigate("/game");
    }, 0);
  };

  conso
  handleStartGame("regular", "RegularA", "RegularB");

  useEffect(() => {
    navigate('/game');
  }, [navigate]);

  return null;
};

export default GameRedirect;
