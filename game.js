import {gameState as game} from "./gameState.js";
import {createScene} from "./createScene.js";
import {moveSphere} from "./moveSphere.js";
import {updateScoreText} from "./updateScoreText.js";
import {applyCollision} from "./applyCollision.js";

// Init
game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);
await createScene(game);

// Render loop
game.engine.runRenderLoop(function () {
  applyCollision(game);
  moveSphere(game);
  updateScoreText(game);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
