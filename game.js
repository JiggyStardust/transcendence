
import {gameState as game} from "./gameState.js";
import {createScene} from "./createScene.js";
import {applyCollision} from "./applyCollision.js";
import {move} from "./move.js";

// Init
game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);
await createScene(game);

// Init Sphere Position and Direction
game.sphere.position.x = move.xStartingPosition;
game.sphere.position.z = move.zStartingPosition;

// Score text
const array = ["0", "1", "2", "3", "4", "5", "6", "7"];

// Render loop
game.engine.runRenderLoop(function () {
  // Get deltatime
  const deltaTime = game.engine.getDeltaTime() / 1000;

  // Move sphere
  game.sphere.position.addInPlace(move.direction.scale(move.ballSpeed * deltaTime));

  // Update score text
  array.forEach((x) => {
    game.scoreTextLeft = game.scene.getMeshByName("scoreTextLeft" + x);
    game.scoreTextRight = game.scene.getMeshByName("scoreTextRight" + x);

    if (game.scoreP1 == x)
      game.scoreTextLeft.setEnabled(true);
    else
      game.scoreTextLeft.setEnabled(false);
    if (game.scoreP2 == x)
      game.scoreTextRight.setEnabled(true);
    else
      game.scoreTextRight.setEnabled(false);
  });

  applyCollision(game, move);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
