// @ts-nocheck
import { useEffect, useRef } from 'react';
import { useGame } from '../../src/context/GameContext';

export default function BabylonGame() {
  const canvasRef = useRef(null);
  const { gameState, updateGameState , setGameWinner} = useGame();
  const gameRef = useRef(null);

  useEffect(() => {
    const initGame = async () => {
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

      // Init
      game.canvas = canvasRef.current;
      game.engine = new BABYLON.Engine(game.canvas, true);
      gameRef.current = game;

      if (window.numberOfPlayers == 3)
        game.hasThirdPlayer = true;
      
      parseUsername(game, gameState.players);
      await createScene(game);

      game.score.p1 = 0;
      game.score.p2 = 0;
      game.currentState = game.state.start;

      // Render loop
      game.engine.runRenderLoop(function () {
        game.canvas.focus();
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
        game.engine.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (game.engine) {
          game.engine.dispose();
        }
      };
    };

    const cleanup = initGame();

    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [gameState.players, updateGameState]);

  return (
    <div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
      <canvas ref={canvasRef} width="1280" height="720" id="renderCanvas"></canvas>
    </div>
  );
}