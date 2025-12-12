// @ts-nocheck
import { useEffect } from "react";
import { useGame } from '../context/GameContext';

export default function Game() {
  const { gameState } = useGame();

  useEffect(() => {
    // Expose entire gameState to the global window object
    window.gameContext = gameState;
    
    const script = document.createElement('script');
    script.src = '/game/mainGame.js';
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      if (script.parentNode === document.body) {
        document.body.removeChild(script);
      }
      // Clean up the global variable
      delete window.gameContext;
    };
  }, [gameState]);

  return (
    <div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
      <canvas width="1280" height="720" id="renderCanvas"></canvas>
    </div>
  );
}