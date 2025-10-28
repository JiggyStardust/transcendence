
function createScene(engine, canvas) {
    // Init
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 7, -6), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0.7), scene);
    light.intensity = 0.5;

    // Create materials
    var mPaddle = new BABYLON.StandardMaterial("mPaddle", scene);
    mPaddle.diffuseColor = new BABYLON.Color3(2, 2, 2);

    var mWall = new BABYLON.StandardMaterial("mWall", scene);
    mWall.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.4);

    var mGround = new BABYLON.StandardMaterial("mGround", scene);
    mGround.diffuseColor = new BABYLON.Color3(0, 0, 0);

    var mSphere = new BABYLON.StandardMaterial("mSphere", scene);
    mSphere.diffuseColor = new BABYLON.Color3(1, 1, 1);
    mSphere.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0.7);


    // Create paddles
    var paddle1 = BABYLON.MeshBuilder.CreateBox("paddle1", {width: 0.2, height: 0.3, depth: 1.5}, scene);
    paddle1.position.y = 0.125;
    paddle1.position.z = 0;
    paddle1.material = mPaddle;
    var paddle2 = paddle1.clone("paddle2");
    paddle1.position.x = -2.7;
    paddle2.position.x = 2.7;

    //Sidewalls

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
    
    // Create ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    ground.material = mGround;

    // Create sphere
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.4, segments: 32}, scene);
    sphere.position.y = 0.2;
    sphere.material = mSphere;

    // Create center line
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

    // Move the sphere each frame
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

    return scene;
}

// When the web page is fully loaded, then run this function
window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);
  var scene = createScene(engine, canvas);

  // Movement parameters
  let startingBallSpeed = 4;
  let ballSpeed = startingBallSpeed;
  let direction = new BABYLON.Vector3(ballSpeed, 0, 2).normalize();

  // Score
  let scoreP1 = 0;
  let scoreP2 = 0;

  // Collision
  let paddleCollisionX = 2.4;
  let scoreCollisionX = 2.6;
  let sideCollisionZ = 2.6;
  let paddleSize = 1.5;

  // Get objects from scene
  const sphere = scene.getMeshByName("sphere");
  const paddle1 = scene.getMeshByName("paddle1");
  const paddle2 = scene.getMeshByName("paddle2");

  // Render loop
  engine.runRenderLoop(function () {
    const deltaTime = engine.getDeltaTime() / 1000; // convert ms to seconds
    sphere.position.addInPlace(direction.scale(ballSpeed * deltaTime));

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
      paddleTimer = 0;
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

  // Resize handler
  window.addEventListener('resize', function () {
    engine.resize();
  });
});
