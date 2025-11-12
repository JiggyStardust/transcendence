import {game} from "./game.js";
import {createScene} from "./createScene.js";
import {moveSphere} from "./moveSphere.js";
import {updateScoreText} from "./updateScoreText.js";
import {countdown} from "./countdown.js";
import {applyCollision} from "./applyCollision.js";
import {pointScored} from "./pointScored.js";

// Init
game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);
await createScene(game);

// Render loop
game.engine.runRenderLoop(function () {
  switch(game.currentState) {
    case game.state.start:
      countdown(game);
      break;
    case game.state.playing:
      applyCollision(game);
      moveSphere(game);
      break;
    case game.state.pointScored:
      pointScored(game);
      break;
    case game.state.reset:
      countdown(game);
      break;
    case game.state.gameOver:
      break;
    }
  updateScoreText(game);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
