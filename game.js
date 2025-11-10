
import {gameState as game} from "./gameState.js";
import {createScene} from "./createScene.js";
import {applyCollision} from "./applyCollision.js";
import {move} from "./move.js";

game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);
await createScene(game);

// Get objects from scene
game.sphere = game.scene.getMeshByName("sphere");
game.paddle1 = game.scene.getMeshByName("paddle1");
game.paddle2 = game.scene.getMeshByName("paddle2");

// Init Sphere Position and Direction
game.sphere.position.x = move.xStartingPosition;
game.sphere.position.z = move.zStartingPosition;

// Score
let scoreP1 = 0;
let scoreP2 = 0;
let maxScore = 700;

// Score text
const scoreTextLeft = game.scene.getMeshByName("scoreTextLeft" + scoreP1);
scoreTextLeft.position = new BABYLON.Vector3(-1, 0, 4);
scoreTextLeft.rotation.x = 0.7;
const array = ["0", "1", "2", "3", "4", "5", "6", "7"];

// Render loop
game.engine.runRenderLoop(function () {
  // Get deltatime
  const deltaTime = game.engine.getDeltaTime() / 1000;

  // Move sphere
  game.sphere.position.addInPlace(move.direction.scale(move.ballSpeed * deltaTime));

  // Update score text
  array.forEach((x) => {
    const scoreTextLeft = game.scene.getMeshByName("scoreTextLeft" + x);
    const scoreTextRight = game.scene.getMeshByName("scoreTextRight" + x);

    if (scoreP1 == x)
      scoreTextLeft.setEnabled(true);
    else
      scoreTextLeft.setEnabled(false);
    if (scoreP2 == x)
      scoreTextRight.setEnabled(true);
    else
      scoreTextRight.setEnabled(false);
  });

  // Apply Collision
  applyCollision(game.sphere, move, game.paddle1, game.paddle2);


  // Render scene
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
