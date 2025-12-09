import {game} from "./game.js";
import {parseUsername} from "./parseUsername.js";
import {createScene} from "./createScene.js";
import {applyCollision} from "./applyCollision.js";
import {moveSphere} from "./moveSphere.js";
import {updateScoreText} from "./updateScoreText.js";
import {pointScored} from "./pointScored.js";
import {reset} from "./reset.js";
import {gameOver} from "./gameOver.js";

// Init
game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);

if (window.numberOfPlayers == 3)
  game.hasThirdPlayer = true;

parseUsername(game);
await createScene(game);

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
      gameOver(game);
      break;
    }
  updateScoreText(game);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
