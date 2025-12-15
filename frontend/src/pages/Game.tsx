// @ts-nocheck
import { useEffect } from "react";
import { useGame } from '../context/GameContext';

export default function Game() {
  const { gameState } = useGame();

  // Update window.gameContext whenever gameState changes
  useEffect(() => {}, [gameState]);

  // Load the game script only once when component mounts
  useEffect(() => {
    // Add a timestamp to force script reload
    const script = document.createElement('script');
    script.src = `/game/mainGame.js?t=${Date.now()}`;
    script.type = "module";
    
    // Wait for canvas to be ready
    const loadScript = () => {
      document.body.appendChild(script);
    };
    
    // Small delay to ensure canvas is mounted
    const timer = setTimeout(loadScript, 10);

    return () => {
      clearTimeout(timer);
      if (script.parentNode === document.body) {
        document.body.removeChild(script);
      }
    };
  }, []);                 

  return (
    <div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
      {isLoading && (
        <div className="absolute text-black text-2xl">
          Loading game...
        </div>
      )}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        width="1280"
        height="720"
        id="renderCanvas"
        style={{
          display: isLoading ? 'none' : 'block',
          outline: 'none'
        }}
      />
    </div>
  );
}
