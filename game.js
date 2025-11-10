import {gameState as game} from "./gameState.js";
import {createScene} from "./createScene.js";
import {moveSphere} from "./moveSphere.js";
import {updateScoreText} from "./updateScoreText.js";
import {applyCollision} from "./applyCollision.js";
import {move} from "./move.js";

// Init
game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);
await createScene(game);

// Init Sphere Position and Direction
game.sphere.position.x = move.xStartingPosition;
game.sphere.position.z = move.zStartingPosition;

// Render loop
game.engine.runRenderLoop(function () {
  applyCollision(game, move);
  moveSphere(game, move);
  updateScoreText(game);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
