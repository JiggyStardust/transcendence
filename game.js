
import {createScene} from "./createScene.js";
import {applyCollision} from "./applyCollision.js";
import {move} from "./move.js";

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Create scene
const scene = await createScene(engine);

// Get objects from scene
const sphere = scene.getMeshByName("sphere");
const paddle1 = scene.getMeshByName("paddle1");
const paddle2 = scene.getMeshByName("paddle2");

// Init Sphere Position and Direction
sphere.position.x = move.xStartingPosition;
sphere.position.z = move.zStartingPosition;

// Score
let scoreP1 = 0;
let scoreP2 = 0;
let maxScore = 700;

// Score text
const scoreTextLeft = scene.getMeshByName("scoreTextLeft" + scoreP1);
scoreTextLeft.position = new BABYLON.Vector3(-1, 0, 4);
scoreTextLeft.rotation.x = 0.7;
const array = ["0", "1", "2", "3", "4", "5", "6", "7"];

// Render loop
engine.runRenderLoop(function () {
  // Get deltatime
  const deltaTime = engine.getDeltaTime() / 1000;

  // Move sphere
  sphere.position.addInPlace(move.direction.scale(move.ballSpeed * deltaTime));

  // Update score text
  array.forEach((x) => {
    const scoreTextLeft = scene.getMeshByName("scoreTextLeft" + x);
    const scoreTextRight = scene.getMeshByName("scoreTextRight" + x);

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
  applyCollision(sphere, move, paddle1, paddle2);


  // Render scene
  scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  engine.resize();
});
