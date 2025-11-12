
export async function createScene(game) {
  // Create scene
  game.scene = new BABYLON.Scene(game.engine);

  // Create Camera
  game.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 7, -6), game.scene);
  game.camera.setTarget(BABYLON.Vector3.Zero());

  // Create Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0.7), game.scene);
  light.intensity = 0.5;

  // Create Materials
  var mPaddle = new BABYLON.StandardMaterial("mPaddle", game.scene);
  mPaddle.diffuseColor = new BABYLON.Color3(2, 2, 2);

  var mWall = new BABYLON.StandardMaterial("mWall", game.scene);
  mWall.diffuseColor = new BABYLON.Color3(0.6, 0.75, 0.75);

  var mGround = new BABYLON.StandardMaterial("mGround", game.scene);
  mGround.diffuseColor = new BABYLON.Color3(0, 0, 0);

  const mScoreText = new BABYLON.StandardMaterial("mScoreText", game.scene);
  mScoreText.diffuseColor = new BABYLON.Color3(1.0, 0.75, 0.2);
  mScoreText.emissiveColor = new BABYLON.Color3(1.0, 0.6, 0.1);
  mScoreText.specularColor = new BABYLON.Color3(0.2, 0.1, 0.0);
  mScoreText.alpha = 1.0;

  const mRedText = new BABYLON.StandardMaterial("mRedText", game.scene);
  mRedText.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);
  mRedText.emissiveColor = new BABYLON.Color3(0.75, 0.1, 0.0);
  mRedText.specularColor = new BABYLON.Color3(0.3, 0.1, 0.1);
  mRedText.alpha = 1.0;

  var mScoreBoard = new BABYLON.StandardMaterial("mScoreText", game.scene);
  mScoreBoard.diffuseColor = new BABYLON.Color3(0.6, 0.75, 0.75);

  var mSphere = new BABYLON.StandardMaterial("mSphere", game.scene);
  mSphere.diffuseColor = new BABYLON.Color3(1, 1, 1);
  mSphere.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0.7);

  // Paddles
  game.paddle1 = BABYLON.MeshBuilder.CreateBox("paddle1", {width: 0.2, height: 0.3, depth: 1.5}, game.scene);
  game.paddle1.position.y = 0.125;
  game.paddle1.position.z = 0;
  game.paddle1.material = mPaddle;
  game.paddle2 = game.paddle1.clone("paddle2");
  game.paddle1.position.x = -2.7;
  game.paddle2.position.x = 2.7;

  // Load font
  const fontArial = await (await fetch("assets/Arial_Regular.json")).json();
  const fontScoreBoard = await (await fetch("assets/Score_Board_Regular.json")).json();

  
  // Gameover text
  game.gameOverText = BABYLON.MeshBuilder.CreateText(
    "gameOverText",
    "GAMEOVER",
    fontArial,
    {size: 1, resolution: 64,depth: 0.2},
    game.scene
  );
  game.gameOverText.material = mRedText;
  game.gameOverText.setEnabled(false);
  game.gameOverText.position = new BABYLON.Vector3(0, 1, 1);

  // Scoreboard and text positions

  var boardVec = new BABYLON.Vector3(0, 1.25, 2.95);
  var countVec =  new BABYLON.Vector3(0, boardVec.y, 2.95);
  var scoreLeftVec = new BABYLON.Vector3(-1, boardVec.y - 0.6, 2.95);
  var scoreRightVec = new BABYLON.Vector3(1, boardVec.y - 0.6, 2.95);

  // Countdown text
  const array2 = ["1", "2", "3"];
  array2.forEach((x) => {
      const countdownText = BABYLON.MeshBuilder.CreateText(
      "countdownText" + x,
      x,
      fontScoreBoard,
      {size: 0.5, resolution: 64,depth: 0.5},
      game.scene
    );
    countdownText.material = mRedText;
    countdownText.rotation.x = 0.0;
    countdownText.rotation.z = 0.0;
    countdownText.setEnabled(false);
    countdownText.position = countVec;
  });

  game.countdownText1 = game.scene.getMeshByName("countdownText1");
  game.countdownText2 = game.scene.getMeshByName("countdownText2");
  game.countdownText3 = game.scene.getMeshByName("countdownText3");

  // Score text
  const array = ["0", "1", "2", "3", "4", "5", "6", "7"];
  array.forEach((x) => {
      const scoreTextLeft = BABYLON.MeshBuilder.CreateText(
      "scoreTextLeft" + x,
      x,
      fontScoreBoard,
      {size: 1, resolution: 64,depth: 0.5},
      game.scene
    );
    scoreTextLeft.material = mScoreText;
    scoreTextLeft.rotation.x = 0;
    scoreTextLeft.setEnabled(false);
  
    const scoreTextRight = scoreTextLeft.clone("scoreTextRight" + x);
    
    scoreTextLeft.position = scoreLeftVec;
    scoreTextRight.position = scoreRightVec;
  });

  // ScoreBoard
  const scoreBoard = BABYLON.MeshBuilder.CreateBox("scoreBoard", {width: 3.5, height: 1.75, depth: 0.3}, game.scene);
  scoreBoard.position = boardVec;
  scoreBoard.material = mScoreBoard;


  // Sidewalls
  var wallTop = BABYLON.MeshBuilder.CreateBox("wallTop", {width: 6, height: 0.2, depth: 0.2}, game.scene);
  wallTop.position.y = 0.1;
  wallTop.position.x = 0;
  wallTop.material = mWall;
  var wallBottom = wallTop.clone("wallBottom");
  wallTop.position.z = 2.9;
  wallBottom.position.z = -2.9;

  var wallLeft = BABYLON.MeshBuilder.CreateBox("wallTop", {width: 0.2, height: 0.2, depth: 6}, game.scene);
  wallLeft.position.y = 0.1;
  wallLeft.material = mWall;
  var wallRight = wallLeft.clone("wallRight");
  wallLeft.position.x = -2.9;
  wallRight.position.x = 2.9;
  
  // Ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, game.scene);
  ground.material = mGround;

  // Sphere
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.4, segments: 32}, game.scene);
  sphere.position.y = 0.2;
  sphere.material = mSphere;

  // Center line
  var centerLine = BABYLON.MeshBuilder.CreateBox("centerLine", {width: 0.1, height: 0.1, depth: 5.8}, game.scene);
  centerLine.position.y = -0.049;
  centerLine.position.z = 0;
  centerLine.material = mPaddle;

  // Keyboard input
  const inputMap = {};
  game.scene.actionManager = new BABYLON.ActionManager(game.scene);

  game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyDownTrigger,
    (evt) => { inputMap[evt.sourceEvent.key] = true; }
  ));
  game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyUpTrigger,
    (evt) => { inputMap[evt.sourceEvent.key] = false; }
  ));

  game.scene.onBeforeRenderObservable.add(() => {
    const paddleSpeed = 0.17;
    const sidePosition = 2.05;
    if (game.currentState != game.state.pointScored) {
      if (inputMap["w"] && game.paddle1.position.z + paddleSpeed < sidePosition) {
        game.paddle1.position.z += paddleSpeed;
      }
      if (inputMap["s"] && game.paddle1.position.z - paddleSpeed > -sidePosition) {
        game.paddle1.position.z -= paddleSpeed;
      }
      if (inputMap["ArrowUp"] && game.paddle2.position.z + paddleSpeed < sidePosition) {
        game.paddle2.position.z += paddleSpeed;
      }
      if (inputMap["ArrowDown"] && game.paddle2.position.z - paddleSpeed > -sidePosition) {
        game.paddle2.position.z -= paddleSpeed;
      }
    }
  });

  // Attach objects
  game.sphere = game.scene.getMeshByName("sphere");
  game.sphere.position.x = game.move.xStartingPosition;
  game.sphere.position.z = game.move.zStartingPosition;

  game.paddle1 = game.scene.getMeshByName("paddle1");
  game.paddle2 = game.scene.getMeshByName("paddle2");
}