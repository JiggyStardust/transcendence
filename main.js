import {game} from "./game.js";
import {createScene} from "./createScene.js";
import {moveSphere} from "./moveSphere.js";
import {updateScoreText} from "./updateScoreText.js";
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
      console.log("state: start");
      break;
    case game.state.playing:
      console.log("state: playing");
      applyCollision(game);
      moveSphere(game);
      break;
    case game.state.pointScored:
      console.log("state: pointScored");
      pointScored(game);
      break;
    case game.state.reset:
      console.log("state: reset");
      break;
    case game.state.gameOver:
      console.log("state: gameOver");
      break;
    }
  updateScoreText(game);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
