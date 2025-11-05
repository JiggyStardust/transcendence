// game.js

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

async function createScene() {
  // Create scene
  const scene = new BABYLON.Scene(engine);

  // Create Camera
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 7, -6), scene);
  camera.setTarget(BABYLON.Vector3.Zero());

  // Create Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0.7), scene);
  light.intensity = 0.5;

  // Create Materials
  var mPaddle = new BABYLON.StandardMaterial("mPaddle", scene);
  mPaddle.diffuseColor = new BABYLON.Color3(2, 2, 2);

  var mWall = new BABYLON.StandardMaterial("mWall", scene);
  mWall.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.4);

  var mGround = new BABYLON.StandardMaterial("mGround", scene);
  mGround.diffuseColor = new BABYLON.Color3(0, 0, 0);

  var mScoreText = new BABYLON.StandardMaterial("mScoreText", scene);
  mScoreText.diffuseColor = new BABYLON.Color3(5, 5, 5);

  var mSphere = new BABYLON.StandardMaterial("mSphere", scene);
  mSphere.diffuseColor = new BABYLON.Color3(1, 1, 1);
  mSphere.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0.7);

  // Create Meshes

  // Paddles
  var paddle1 = BABYLON.MeshBuilder.CreateBox("paddle1", {width: 0.2, height: 0.3, depth: 1.5}, scene);
  paddle1.position.y = 0.125;
  paddle1.position.z = 0;
  paddle1.material = mPaddle;
  var paddle2 = paddle1.clone("paddle2");
  paddle1.position.x = -2.7;
  paddle2.position.x = 2.7;

  // Sidewalls
  var wallTop = BABYLON.MeshBuilder.CreateBox("wallTop", {width: 6, height: 0.2, depth: 0.2}, scene);
  wallTop.position.y = 0.1;
  wallTop.position.x = 0;
  wallTop.material = mWall;
  var wallBottom = wallTop.clone("wallBottom");
  wallTop.position.z = 2.9;
  wallBottom.position.z = -2.9;

  var wallLeft = BABYLON.MeshBuilder.CreateBox("wallTop", {width: 0.2, height: 0.2, depth: 6}, scene);
  wallLeft.position.y = 0.1;
  wallLeft.material = mWall;
  var wallRight = wallLeft.clone("wallRight");
  wallLeft.position.x = -2.9;
  wallRight.position.x = 2.9;
  
  // Ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
  ground.material = mGround;

  // Sphere
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.4, segments: 32}, scene);
  sphere.position.y = 0.2;
  sphere.material = mSphere;

  // Center line
  var centerLine = BABYLON.MeshBuilder.CreateBox("centerLine", {width: 0.1, height: 0.1, depth: 5.8}, scene);
  centerLine.position.y = -0.049;
  centerLine.position.z = 0;
  centerLine.material = mPaddle;

  // Keyboard input
  const inputMap = {};
  scene.actionManager = new BABYLON.ActionManager(scene);

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyDownTrigger,
    (evt) => { inputMap[evt.sourceEvent.key] = true; }
  ));
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyUpTrigger,
    (evt) => { inputMap[evt.sourceEvent.key] = false; }
  ));

  scene.onBeforeRenderObservable.add(() => {
    const paddleSpeed = 0.07;
    const sidePosition = 2.05;

    if (inputMap["w"] && paddle1.position.z + paddleSpeed < sidePosition) {
      paddle1.position.z += paddleSpeed;
    }
    if (inputMap["s"] && paddle1.position.z - paddleSpeed > -sidePosition) {
      paddle1.position.z -= paddleSpeed;
    }
    if (inputMap["ArrowUp"] && paddle2.position.z + paddleSpeed < sidePosition) {
      paddle2.position.z += paddleSpeed;
    }
    if (inputMap["ArrowDown"] && paddle2.position.z - paddleSpeed > -sidePosition) {
      paddle2.position.z -= paddleSpeed;
    }
  });

  // Load font
  const fontData = await (await fetch("Roboto_Regular.json")).json();

  // Score text
  const array = ["0", "1", "2", "3", "4", "5", "6", "7"];
  array.forEach((x) => {
      const scoreTextLeft = BABYLON.MeshBuilder.CreateText(
      "scoreTextLeft" + x,
      x,
      fontData,
      {size: 1, resolution: 64,depth: 1},
      scene
    );
    scoreTextLeft.material = mScoreText;
    scoreTextLeft.rotation.x = 0.7;
    scoreTextLeft.setEnabled(false);
  
    const scoreTextRight = scoreTextLeft.clone("scoreTextRight" + x);
    
    scoreTextLeft.position = new BABYLON.Vector3(-1, 0, 4);
    scoreTextRight.position = new BABYLON.Vector3(1, 0, 4);
  });

  return scene;
}

// ----------------------------------------------------------------------------
// MAIN -----------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Create scene
const scene = await createScene();

// Movement parameters
let startingBallSpeed = 4;
let ballSpeed = startingBallSpeed;
let direction = new BABYLON.Vector3(ballSpeed, 0, 2).normalize();

// Score
let scoreP1 = 0;
let scoreP2 = 0;
let maxScore = 7;

// Collision
let paddleCollisionX = 2.4;
let scoreCollisionX = 2.6;
let sideCollisionZ = 2.6;
let paddleSize = 1.5;

// Get objects from scene
const sphere = scene.getMeshByName("sphere");
const paddle1 = scene.getMeshByName("paddle1");
const paddle2 = scene.getMeshByName("paddle2");

const scoreTextLeft = scene.getMeshByName("scoreTextLeft" + scoreP1);
scoreTextLeft.position = new BABYLON.Vector3(-1, 0, 4);
scoreTextLeft.rotation.x = 0.7;
const array = ["0", "1", "2", "3", "4", "5", "6", "7"];

// Render loop
engine.runRenderLoop(function () {
  const deltaTime = engine.getDeltaTime() / 1000; // convert ms to seconds
  sphere.position.addInPlace(direction.scale(ballSpeed * deltaTime));

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
  if (sphere.position.x < -paddleCollisionX
          && paddle1.position.z < sphere.position.z + (paddleSize / 2)
          && paddle1.position.z > sphere.position.z - (paddleSize / 2)
          && direction.x < 0) {
    direction.x = -direction.x;
  }
  else if (sphere.position.x > paddleCollisionX
          && paddle2.position.z < sphere.position.z + (paddleSize / 2)
          && paddle2.position.z > sphere.position.z - (paddleSize / 2)
          && direction.x > 0) {
    direction.x = -direction.x;
  }
  else if (sphere.position.z > sideCollisionZ && direction.z > 0) {
    direction.z = -direction.z;
  }
  else if (sphere.position.z < -sideCollisionZ && direction.z < 0) {
    direction.z = -direction.z;
  }
  else if (sphere.position.x > scoreCollisionX) {
    direction.x = -direction.x;
    sphere.position.x = 0;
    sphere.position.z = 0;
    ballSpeed = startingBallSpeed;
    direction = new BABYLON.Vector3(ballSpeed, 0, 2).normalize();
    scoreP1++;
  }
  else if (sphere.position.x < -scoreCollisionX) {
    direction.x = -direction.x;
    sphere.position.x = 0;
    sphere.position.z = 0;
    ballSpeed = startingBallSpeed;
    direction = new BABYLON.Vector3(ballSpeed, 0, 2).normalize();
    scoreP2++;
  }

  // Render scene
  scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  engine.resize();
});
