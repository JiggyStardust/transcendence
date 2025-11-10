
import {createScene} from "./createScene.js";
import {Movement} from "./movement.js";

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Create scene
const scene = await createScene(engine);

// Get objects from scene
const sphere = scene.getMeshByName("sphere");
const paddle1 = scene.getMeshByName("paddle1");
const paddle2 = scene.getMeshByName("paddle2");

// Init Sphere Position and Direction
let direction = new BABYLON.Vector3(Movement.xStartingAngle, 0, Movement.zStartingAngle);
sphere.position.x = Movement.xStartingPosition;
sphere.position.z = Movement.zStartingPosition;

// Score
let scoreP1 = 0;
let scoreP2 = 0;
let maxScore = 700;

//GameOver
let gameOver = false; // DEBUG CHANGE BACK TO FALSE

// Collision
let paddleCollisionX = 2.4;
let scoreCollisionX = 2.6;
let sideCollisionZ = 2.6;
let paddleSize = 1.5;
let paddleCollisionSize = 0.95;

// Score text
const scoreTextLeft = scene.getMeshByName("scoreTextLeft" + scoreP1);
scoreTextLeft.position = new BABYLON.Vector3(-1, 0, 4);
scoreTextLeft.rotation.x = 0.7;
const array = ["0", "1", "2", "3", "4", "5", "6", "7"];

// Render loop
engine.runRenderLoop(function () {
  // Get deltatime
  const deltaTime = engine.getDeltaTime() / 1000;

  // Check for GameOver
  if (scoreP1 >= maxScore || scoreP2 >= maxScore)
    gameOver = true;

  // Move sphere
  if (!gameOver)
    sphere.position.addInPlace(direction.scale(Movement.ballSpeed * deltaTime));

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


  // Bounce the ball

  // Paddle1
  if (sphere.position.x < -paddleCollisionX
          && paddle1.position.z < sphere.position.z + (paddleCollisionSize)
          && paddle1.position.z > sphere.position.z - (paddleCollisionSize)
          && direction.x < 0) {
    if (Movement.ballSpeed < Movement.maxBallSpeed)
      Movement.ballSpeed += Movement.ballSpeedIncrement;
    if (paddle1.position.z < sphere.position.z + (paddleSize / 6)
          && paddle1.position.z > sphere.position.z - (paddleSize / 6)) {
      console.log("middle");
      direction.x = -direction.x;
    }
    else if (paddle1.position.z < sphere.position.z){
      console.log("top");
      // Sphere moving up
      if (direction.z > 0) {
        direction.x = Movement.vxLarge;
        direction.z = Movement.vzLarge;
      }
      // Sphere moving down
      else if (direction.z < 0) {
        // SmallAngle
        if (direction.x == Movement.vxSmall) {
          direction.x = Movement.vxStraight;
          direction.z = Movement.vzStraight;
        }
        // LargeAngle
        else {
          direction.x = Movement.vxSmall;
          direction.z = -Movement.vzSmall;
        }
      }
      // Sphere moving straight
      else {
        direction.x = Movement.vxSmall;
        direction.z = Movement.vzSmall;
      }
    }
    else {
      console.log("bottom");
      if (direction.z > 0) {
        if (direction.x == Movement.vxLarge) {
          direction.x = Movement.vxSmall;
          direction.z = Movement.vzSmall;
        }
        else {
          direction.x = Movement.vxStraight;
          direction.z = Movement.vzStraight;
        }
      }
      else if (direction.z < 0) {
        direction.x = Movement.vxLarge;
        direction.z = -Movement.vzLarge;
      }
      else {
        direction.x = Movement.vxSmall;
        direction.z = -Movement.vzSmall;
      }
    }
    console.log(direction.x + " " + direction.z);
  }
  // Paddle2
  else if (sphere.position.x > paddleCollisionX
          && paddle2.position.z < sphere.position.z + (paddleCollisionSize)
          && paddle2.position.z > sphere.position.z - (paddleCollisionSize)
          && direction.x > 0) {
    if (Movement.ballSpeed < Movement.maxBallSpeed)
      Movement.ballSpeed += Movement.ballSpeedIncrement;
    if (paddle2.position.z < sphere.position.z + (paddleSize / 6)
          && paddle2.position.z > sphere.position.z - (paddleSize / 6)) {
      console.log("middle");
      direction.x = -direction.x;
    }
    else if (paddle2.position.z < sphere.position.z){
      console.log("top");
      // Down
      if (direction.z > 0) {
        direction.x = -Movement.vxLarge;
        direction.z = Movement.vzLarge;
      }
      // Up
      else if (direction.z < 0) {
        if (direction.x == Movement.vxSmall) {
          direction.x = -Movement.vxStraight;
          direction.z = Movement.vzStraight;
        }
        else {
          direction.x = -Movement.vxSmall;
          direction.z = -Movement.vzSmall;
        }
      }
      // Mid
      else {
        direction.x = -Movement.vxSmall;
        direction.z = Movement.vzSmall;
      }
    }
    else {
      console.log("bottom");
      // Up
      if (direction.z > 0) {
        if (direction.x == Movement.vxLarge) {
          direction.x = -Movement.vxSmall;
          direction.z = Movement.vzSmall;
        }
        else {
          direction.x = -Movement.vxStraight;
          direction.z = Movement.vzStraight;
        }
      }
      // Down
      else if (direction.z < 0) {
        direction.x = -Movement.vxLarge;
        direction.z = -Movement.vzLarge;
      }
      // Mid
      else {
        direction.x = -Movement.vxSmall;
        direction.z = -Movement.vzSmall;
      }
    }
    
  }
  // Sides
  else if (sphere.position.z > sideCollisionZ && direction.z > 0) {
    direction.z = -direction.z;
  }
  else if (sphere.position.z < -sideCollisionZ && direction.z < 0) {
    direction.z = -direction.z;
  }
  // Scoring
  else if (sphere.position.x > scoreCollisionX) {
    direction.x = -direction.x;
    sphere.position.x = Movement.xStartingPosition;
    sphere.position.z = Movement.zStartingPosition;
    Movement.ballSpeed = Movement.startingBallSpeed;
    direction = new BABYLON.Vector3(Movement.xStartingAngle, 0, Movement.zStartingAngle);
    scoreP1++;
  }
  else if (sphere.position.x < -scoreCollisionX) {
    direction.x = -direction.x;
    sphere.position.x = Movement.xStartingPosition;
    sphere.position.z = Movement.zStartingPosition;
    Movement.ballSpeed = Movement.startingBallSpeed;
    direction = new BABYLON.Vector3(Movement.xStartingAngle, 0, Movement.zStartingAngle);
    scoreP2++;
  }

  // Render scene
  scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  engine.resize();
});
