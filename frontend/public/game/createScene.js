
export async function createScene(game) {
  // Create scene
  game.scene = new BABYLON.Scene(game.engine);

  // Create Camera
  game.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, game.startingCameraY, -6), game.scene);
  game.camera.setTarget(BABYLON.Vector3.Zero());

  // Create Main Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0.7), game.scene);
  light.intensity = 0.47;

  // Create scoreboard lights

  const yellowLightLeft = new BABYLON.PointLight("yellowLightLeft",
    new BABYLON.Vector3(-1, 1.2, 2.6), game.scene);
  yellowLightLeft.intensity = 0.25;
  yellowLightLeft.diffuse = new BABYLON.Color3(1, 1, 0);
  yellowLightLeft.range = 3;

  const yellowLightRight = new BABYLON.PointLight("yellowLightRight",
    new BABYLON.Vector3(1, 1.2, 2.6), game.scene);
  yellowLightRight.intensity = 0.25;
  yellowLightRight.diffuse = new BABYLON.Color3(1, 1, 0);
  yellowLightRight.range = 3;

  game.light.redArrow = new BABYLON.PointLight("redArrow",
    new BABYLON.Vector3(0, 0.75, 2.6), game.scene);
  game.light.redArrow.intensity = 0.2;
  game.light.redArrow.diffuse = new BABYLON.Color3(1, 0, 0);
  game.light.redArrow.range = 2;
  game.light.redArrow.setEnabled(false);

  game.light.redCountdown = new BABYLON.PointLight("redCountdown",
    new BABYLON.Vector3(0, 1.5, 2.6), game.scene);
  game.light.redCountdown.intensity = 0.2;
  game.light.redCountdown.diffuse = new BABYLON.Color3(1, 0, 0);
  game.light.redCountdown.range = 2;
  game.light.redCountdown.setEnabled(false);

  game.light.final = new BABYLON.PointLight("final",
    new BABYLON.Vector3(0, 1.2, 2.6), game.scene);
  game.light.final.intensity = 0.25;
  game.light.final.diffuse = new BABYLON.Color3(1, 0, 0);
  game.light.final.range = 2;
  game.light.final.setEnabled(false);


  // Create Materials
  var mPaddle = new BABYLON.StandardMaterial("mPaddle", game.scene);
  mPaddle.diffuseColor = new BABYLON.Color3(2, 2, 2);

  var mWall = new BABYLON.StandardMaterial("mWall", game.scene);
  mWall.diffuseColor = new BABYLON.Color3(0.6, 0.75, 0.75);

  var mGround = new BABYLON.StandardMaterial("mGround", game.scene);
  mGround.diffuseColor = new BABYLON.Color3(0, 0, 0);

  const mScoreText = new BABYLON.StandardMaterial("mScoreText", game.scene);
  mScoreText.diffuseColor = new BABYLON.Color3(1.0, 0.8, 0.2);
  mScoreText.emissiveColor = new BABYLON.Color3(1.0, 0.62, 0.1);
  mScoreText.specularColor = new BABYLON.Color3(0.2, 0.1, 0.0);
  mScoreText.alpha = 1.0;

  const mRedText = new BABYLON.StandardMaterial("mRedText", game.scene);
  mRedText.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);
  mRedText.emissiveColor = new BABYLON.Color3(0.75, 0.13, 0.0);
  mRedText.specularColor = new BABYLON.Color3(0.3, 0.1, 0.1);
  mRedText.alpha = 1.0;

  const mGreenText = new BABYLON.StandardMaterial("mGreenText", game.scene);
  mGreenText.diffuseColor  = new BABYLON.Color3(0.1, 1.0, 0.1);
  mGreenText.emissiveColor = new BABYLON.Color3(0.3, 0.75, 0.25);
  mGreenText.specularColor = new BABYLON.Color3(0.1, 0.3, 0.1);
  mGreenText.alpha = 1.0;

  const mWhiteText = new BABYLON.StandardMaterial("mWhiteText", game.scene);
  mWhiteText.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
  mWhiteText.emissiveColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  mWhiteText.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  mWhiteText.alpha = 1.0;

  var mScoreBoard = new BABYLON.StandardMaterial("mScoreText", game.scene);
  mScoreBoard.diffuseColor = new BABYLON.Color3(0.6, 0.75, 0.75);
  mScoreBoard.specularPower = 1000000;


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
  const fontArial = await (await fetch("game/assets/Arial_Regular.json")).json();
  const fontScoreBoard = await (await fetch("game/assets/Score_Board_Regular.json")).json();
  const fontImpact = await (await fetch("game/assets/Impact_Regular.json")).json();

  // Scoreboard and text positions
  var boardVec = new BABYLON.Vector3(0, 1.25, 2.95);
  var countVec =  new BABYLON.Vector3(0, boardVec.y, 2.95);
  var scoreLeftVec = new BABYLON.Vector3(-1, boardVec.y - 0.4, 2.95);
  var scoreRightVec = new BABYLON.Vector3(1, boardVec.y - 0.4, 2.95);
  var p1Vec = new BABYLON.Vector3(-1, boardVec.y + 0.5, 2.899);
  var p2Vec = new BABYLON.Vector3(1, boardVec.y + 0.5, 2.899);
  var leg1Vec = new BABYLON.Vector3(-1, 0.5, 2.87);
  var leg2Vec = new BABYLON.Vector3(1, 0.5, 2.87);
  var arrowVec =  new BABYLON.Vector3(0, boardVec.y - 0.5, 2.95);
  var arrowRightVec =  new BABYLON.Vector3(0.18, arrowVec.y - 0.14, 2.95);
  var arrowLeftVec =  new BABYLON.Vector3(-0.18, arrowVec.y - 0.14, 2.95);
  var gameOverVec =  new BABYLON.Vector3(0, boardVec.y - 0.2, 2.95);

  // Gameover text
  game.gameOverText = BABYLON.MeshBuilder.CreateText(
    "gameOverText",
    "FINAL",
    fontScoreBoard,
    {size: 0.3, resolution: 64,depth: 0.5},
    game.scene
  );
  game.gameOverText.material = mRedText;
  game.gameOverText.setEnabled(false);
  game.gameOverText.position = gameOverVec;

  // Arrow text
  game.arrowLineText = BABYLON.MeshBuilder.CreateText(
    "arrowLineText",
    "_",
    fontScoreBoard,
    {size: 0.5, resolution: 64, depth: 0.5, letterSpacing: 0},
    game.scene
  );
  game.arrowLineText.material = mRedText;
  game.arrowLineText.setEnabled(false);
  game.arrowLineText.position = arrowVec;

  game.arrowRightText = BABYLON.MeshBuilder.CreateText(
  "arrowRightText",
  ">",
  fontScoreBoard,
  {size: 0.5, resolution: 64, depth: 0.5, letterSpacing: 0},
  game.scene
  );
  game.arrowRightText.material = mRedText;
  game.arrowRightText.setEnabled(false);
  game.arrowRightText.position = arrowRightVec;

  game.arrowLeftText = BABYLON.MeshBuilder.CreateText(
  "arrowLeftText",
  "<",
  fontScoreBoard,
  {size: 0.5, resolution: 64, depth: 0.5, letterSpacing: 0},
  game.scene
  );
  game.arrowLeftText.material = mRedText;
  game.arrowLeftText.setEnabled(false);
  game.arrowLeftText.position = arrowLeftVec;

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
    countdownText.setEnabled(false);
    countdownText.position = countVec;
  });

  game.countdownText1 = game.scene.getMeshByName("countdownText1");
  game.countdownText2 = game.scene.getMeshByName("countdownText2");
  game.countdownText3 = game.scene.getMeshByName("countdownText3");

  // Player name text
  game.p1NameText = BABYLON.MeshBuilder.CreateText(
    "p1NameText",
    game.username.p1Display,
    fontImpact,
    {size: 0.18, resolution: 64,depth: 0.2},
    game.scene
  );
  game.p1NameText.material = mWhiteText;
  game.p1NameText.setEnabled(true);
  game.p1NameText.position = p1Vec;

  game.p2NameText = BABYLON.MeshBuilder.CreateText(
    "p2NameText",
    game.username.p2Display,
    fontImpact,
    {size: 0.18, resolution: 64,depth: 0.2},
    game.scene
  );
  game.p2NameText.material = mWhiteText;
  game.p2NameText.setEnabled(true);
  game.p2NameText.position = p2Vec;


  // Score text
  const array = ["0", "1", "2", "3", "4", "5", "6", "7"];
  array.forEach((x) => {
      const scoreTextLeft = BABYLON.MeshBuilder.CreateText(
      "scoreTextLeft" + x,
      x,
      fontScoreBoard,
      {size: 0.8, resolution: 64,depth: 0.5},
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
  scoreBoard.material.maxSimultaneousLights = 8;

  // Legs
  const leg1 = BABYLON.MeshBuilder.CreateBox("leg1", {width: 0.13, height: 0.5, depth: 0.13}, game.scene);
  leg1.position = leg1Vec;
  leg1.material = mScoreBoard;

  const leg2 = BABYLON.MeshBuilder.CreateBox("leg2", {width: 0.13, height: 0.5, depth: 0.13}, game.scene);
  leg2.position = leg2Vec;
  leg2.material = mScoreBoard;


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

  // Base

  const h = 60;
  const y = (h / 2) * -1;
  var base = BABYLON.MeshBuilder.CreateBox("base", {width: 6, height: h, depth: 6}, game.scene);
  base.position.y = y;
  base.position.x = 0;
  base.material = mWall;
  
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
  game.sphere.position.x = game.move.xStartingPos;
  game.sphere.position.z = game.move.zStartingPos;

  game.paddle1 = game.scene.getMeshByName("paddle1");
  game.paddle2 = game.scene.getMeshByName("paddle2");
}