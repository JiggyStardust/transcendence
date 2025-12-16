// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../src/context/GameContext';
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function BabylonGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState, updateGameState, setGameWinner } = useGame();
  const gameRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);
  const { users, user } = useUser();
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  // Load user data once on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setMe(user);
      }
    };
    loadUserData();
  }, [user]);



  useEffect(() => {
    // Check for correct number of players
    const numberOfUsers = Object.values(users).length;
    if (numberOfUsers < 2) {
      navigate("/");
      return;
    }

    // Return if canvas is not made yet
    if (!canvasRef.current) return;
    if (initializedRef.current) return;
    initializedRef.current = true;
    let isMounted = true;

    // Prevent page from scrolling
    const preventScrollKeys = (e: KeyboardEvent) => {
      const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
      if (keys.includes(e.code) && document.activeElement === canvasRef.current) {
        e.preventDefault();
      }
    };

    const preventScrollWheel = (e: WheelEvent) => {
      if (document.activeElement === canvasRef.current) e.preventDefault();
    };

    window.addEventListener('keydown', preventScrollKeys, { passive: false });
    window.addEventListener('wheel', preventScrollWheel, { passive: false });

    // Warn user before refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Refreshing will reset your game progress!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Initialize Game
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

        if (!isMounted || !canvasRef.current) return;

        game.canvas = canvasRef.current;
        game.engine = new BABYLON.Engine(game.canvas, true);
        gameRef.current = game;
        
        game.hasThirdPlayer = false;
        if (window.numberOfPlayers === 3)
          game.hasThirdPlayer = true;

        parseUsername(game, gameState.players);
        await createScene(game);

        if (!isMounted) {
          game.engine.dispose();
          return;
        }

        game.score.p1 = 0;
        game.score.p2 = 0;
        game.infoSaved = false;
        game.currentState = game.state.start;

        game.engine.runRenderLoop(() => {
          if (!isMounted) return;

          game.canvas.focus();
          if (!game.scene || !game.scene.isReady()) return;

          switch (game.currentState) {
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

        const handleResize = () => { if (game.engine) game.engine.resize(); };
        window.addEventListener('resize', handleResize);
        setIsLoading(false);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (game.engine) { game.engine.stopRenderLoop(); game.engine.dispose(); }
        };
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setIsLoading(false);
      }
    };

    const cleanupPromise = initGame();

    return () => {
      isMounted = false;
      initializedRef.current = false;

      window.removeEventListener('keydown', preventScrollKeys);
      window.removeEventListener('wheel', preventScrollWheel);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      cleanupPromise?.then((cleanup) => cleanup && cleanup());
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
