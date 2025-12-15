// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../src/context/GameContext';

export default function BabylonGame() {
  const canvasRef = useRef(null);
  const { gameState, updateGameState, setGameWinner } = useGame();
  const gameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Ensure canvas is mounted before initializing
    if (!canvasRef.current) return;
    
    // Prevent double initialization in development mode (React StrictMode)
    if (initializedRef.current) return;
    initializedRef.current = true;

    let isMounted = true;
    
    const initGame = async () => {
      try {
        const { game } = await import('../game/game.js');
        const { parseUsername } = await import('../game/parseUsername.js');
        const { createScene } = await import('../game/createScene.js');
        const { applyCollision } = await import('../game/applyCollision.js');
        const { moveSphere } = await import('../game/moveSphere.js');
        const { updateScoreText } = await import('../game/updateScoreText.js');
        const { pointScored } = await import('../game/pointScored.js');
        const { reset } = await import('../game/reset.js');
        const { gameOver } = await import('../game/gameOver.js');
        const { saveGame } = await import('../game/saveGame.tsx');

        // Check if component is still mounted
        if (!isMounted || !canvasRef.current)
          return;

        // Init
        game.canvas = canvasRef.current;
        game.engine = new BABYLON.Engine(game.canvas, true);
        gameRef.current = game;

        if (window.numberOfPlayers == 3)
          game.hasThirdPlayer = true;
        
        parseUsername(game, gameState.players);
        await createScene(game);

        // Check again after async operation
        if (!isMounted) {
          game.engine.dispose();
          return;
        }

        game.score.p1 = 0;
        game.score.p2 = 0;
        game.infoSaved = false;
        game.currentState = game.state.start;

        // Render loop
        game.engine.runRenderLoop(function () {
          if (!isMounted) return;
          
          game.canvas.focus();
          
          // Check if scene is ready
          if (!game.scene || !game.scene.isReady())
            return;
          
          switch(game.currentState) {
            case game.state.start:
              reset(game);
              break;
            case game.state.playing:
              applyCollision(game);
              moveSphere(game);
              break;
            case game.state.pointScored:
              pointScored(game);
              break;
            case game.state.reset:
              reset(game);
              break;
            case game.state.gameOver:
              saveGame(game, gameState, setGameWinner);
              gameOver(game);
              break;
          }
          updateScoreText(game);
          game.scene.render();
        });

        // Window Resize
        const handleResize = () => {
          if (game.engine) {
            game.engine.resize();
          }
        };
        window.addEventListener("resize", handleResize);

        setIsLoading(false);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (game.engine) {
            game.engine.stopRenderLoop();
            game.engine.dispose();
          }
        };
      } catch (error) {
        console.error("Failed to initialize game:", error);
        setIsLoading(false);
      }
    };

    const cleanup = initGame();

    return () => {
      isMounted = false;
      initializedRef.current = false;
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  return (
    <div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
      {isLoading && (
        <div className="absolute text-black text-2xl">Loading game...</div>
      )}
      <canvas 
        ref={canvasRef} 
        width="1280" 
        height="720" 
        id="renderCanvas"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
}