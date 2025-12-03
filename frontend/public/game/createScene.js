
function getKeyboardInput(game) {
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
      if (game.hasThirdPlayer && game.currentState === game.state.playing) {
        if (inputMap["-"] && game.paddle3.position.z + paddleSpeed < 2.45) {
          game.paddle3.position.z += paddleSpeed;
        }
        if (inputMap["+"] && game.paddle3.position.z - paddleSpeed > -2.45) {
          game.paddle3.position.z -= paddleSpeed;
        }
      }
    }
  });
}

function createCamera(game) {
  game.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, game.startingCameraY, -6), game.scene);
  game.camera.setTarget(BABYLON.Vector3.Zero());
}

function createLights(game) {
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
}

function createMaterial(game, material) {
  material.paddle = new BABYLON.StandardMaterial("paddle", game.scene);
  material.paddle.diffuseColor = new BABYLON.Color3(2, 2, 2);

  material.wall = new BABYLON.StandardMaterial("wall", game.scene);
  material.wall.diffuseColor = new BABYLON.Color3(0.6, 0.75, 0.75);

  material.ground = new BABYLON.StandardMaterial("ground", game.scene);
  material.ground.diffuseColor = new BABYLON.Color3(0, 0, 0);

  material.scoreText = new BABYLON.StandardMaterial("scoreText", game.scene);
  material.scoreText.diffuseColor = new BABYLON.Color3(1.0, 0.8, 0.2);
  material.scoreText.emissiveColor = new BABYLON.Color3(1.0, 0.62, 0.1);
  material.scoreText.specularColor = new BABYLON.Color3(0.2, 0.1, 0.0);
  material.scoreText.alpha = 1.0;

  material.redText = new BABYLON.StandardMaterial("redText", game.scene);
  material.redText.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);
  material.redText.emissiveColor = new BABYLON.Color3(0.75, 0.13, 0.0);
  material.redText.specularColor = new BABYLON.Color3(0.3, 0.1, 0.1);
  material.redText.alpha = 1.0;

  material.greenText = new BABYLON.StandardMaterial("greenText", game.scene);
  material.greenText.diffuseColor  = new BABYLON.Color3(0.1, 1.0, 0.1);
  material.greenText.emissiveColor = new BABYLON.Color3(0.3, 0.75, 0.25);
  material.greenText.specularColor = new BABYLON.Color3(0.1, 0.3, 0.1);
  material.greenText.alpha = 1.0;

  material.whiteText = new BABYLON.StandardMaterial("whiteText", game.scene);
  material.whiteText.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
  material.whiteText.emissiveColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  material.whiteText.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  material.whiteText.alpha = 1.0;

  material.scoreboard = new BABYLON.StandardMaterial("scoreText", game.scene);
  material.scoreboard.diffuseColor = new BABYLON.Color3(0.6, 0.75, 0.75);
  material.scoreboard.specularPower = 1000000;

  material.sphere = new BABYLON.StandardMaterial("sphere", game.scene);
  material.sphere.diffuseColor = new BABYLON.Color3(1, 1, 1);
  material.sphere.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0.7);
}

function createPaddles(game, material) {
  game.paddle1 = BABYLON.MeshBuilder.CreateBox("paddle1", {width: 0.2, height: 0.3, depth: 1.5}, game.scene);
  game.paddle1.position.y = 0.125;
  game.paddle1.position.z = 0;
  game.paddle1.material = material.paddle;
  game.paddle2 = game.paddle1.clone("paddle2");
  game.paddle1.position.x = -2.7;
  game.paddle2.position.x = 2.7;

  if (game.hasThirdPlayer) {
    game.paddle3 = BABYLON.MeshBuilder.CreateBox("paddle3", {width: 0.2, height: 0.3, depth: 0.75}, game.scene);
    game.paddle3.position.y = 0.125;
    game.paddle3.position.x = 0;
    game.paddle3.position.z = game.move.p3StartingZ;
  }
}

function createMeshPositions(POS) {
  POS.scoreboard = new BABYLON.Vector3(0, 1.25, 2.95);
  POS.scoreboardP3 = new BABYLON.Vector3(-2.9, 1, 2.95);
  POS.countdown =  new BABYLON.Vector3(0, POS.scoreboard.y, 2.95);
  POS.scoreP1 = new BABYLON.Vector3(-1, POS.scoreboard.y - 0.4, 2.95);
  POS.scoreP2 = new BABYLON.Vector3(1, POS.scoreboard.y - 0.4, 2.95);
  POS.nameP1 = new BABYLON.Vector3(-1, POS.scoreboard.y + 0.5, 2.899);
  POS.nameP2 = new BABYLON.Vector3(1, POS.scoreboard.y + 0.5, 2.899);
  POS.nameP3 = new BABYLON.Vector3(-2.9, 1.05, 2.899);
  POS.legLeft = new BABYLON.Vector3(-1, 0.5, 2.87);
  POS.legRight = new BABYLON.Vector3(1, 0.5, 2.87);
  POS.arrowMiddle =  new BABYLON.Vector3(0, POS.scoreboard.y - 0.5, 2.95);
  POS.arrowLeft =  new BABYLON.Vector3(-0.18, POS.arrowMiddle.y - 0.14, 2.95);
  POS.arrowRight =  new BABYLON.Vector3(0.18, POS.arrowMiddle.y - 0.14, 2.95);
  POS.gameover =  new BABYLON.Vector3(0, POS.scoreboard.y - 0.2, 2.95);
  POS.plusSignP3 = new BABYLON.Vector3(-2.9, 0.75, 2.95);
}

function createGameOverText(game, POS, material, font) {
  game.gameOverText = BABYLON.MeshBuilder.CreateText(
    "gameOverText",
    "FINAL",
    font.scoreboard,
    {size: 0.3, resolution: 64,depth: 0.5},
    game.scene
  );
  game.gameOverText.material = material.redText;
  game.gameOverText.setEnabled(false);
  game.gameOverText.position = POS.gameover;

  if (game.hasThirdPlayer) {
    var p3Border = BABYLON.MeshBuilder.CreateText(
      "gameOverText",
      "+",
      font.scoreboard,
      {size: 0.35, resolution: 64, depth: 0.5, letterSpacing: 0},
      game.scene
    );
    p3Border.material = material.redText;
    p3Border.rotation.y = -0.5;
    p3Border.setEnabled(true);
    p3Border.position = POS.plusSignP3;
  }
}

function createArrowText(game, POS, material, font) {
  game.arrowLineText = BABYLON.MeshBuilder.CreateText(
    "arrowLineText",
    "_",
    font.scoreboard,
    {size: 0.5, resolution: 64, depth: 0.5, letterSpacing: 0},
    game.scene
  );
  game.arrowLineText.material = material.redText;
  game.arrowLineText.setEnabled(false);
  game.arrowLineText.position = POS.arrowMiddle;

  game.arrowRightText = BABYLON.MeshBuilder.CreateText(
  "arrowRightText",
  ">",
  font.scoreboard,
  {size: 0.5, resolution: 64, depth: 0.5, letterSpacing: 0},
  game.scene
  );
  game.arrowRightText.material = material.redText;
  game.arrowRightText.setEnabled(false);
  game.arrowRightText.position = POS.arrowRight;

  game.arrowLeftText = BABYLON.MeshBuilder.CreateText(
  "arrowLeftText",
  "<",
  font.scoreboard,
  {size: 0.5, resolution: 64, depth: 0.5, letterSpacing: 0},
  game.scene
  );
  game.arrowLeftText.material = material.redText;
  game.arrowLeftText.setEnabled(false);
  game.arrowLeftText.position = POS.arrowLeft;
}

function createCountdownText(game, POS, material, font) {
  const array2 = ["1", "2", "3"];
  array2.forEach((x) => {
      const countdownText = BABYLON.MeshBuilder.CreateText(
      "countdownText" + x,
      x,
      font.scoreboard,
      {size: 0.5, resolution: 64,depth: 0.5},
      game.scene
    );
    countdownText.material = material.redText;
    countdownText.setEnabled(false);
    countdownText.position = POS.countdown;
  });

  game.countdownText1 = game.scene.getMeshByName("countdownText1");
  game.countdownText2 = game.scene.getMeshByName("countdownText2");
  game.countdownText3 = game.scene.getMeshByName("countdownText3");
}

function createPlayerNameText(game, POS, material, font) {
  game.p1NameText = BABYLON.MeshBuilder.CreateText(
    "p1NameText",
    game.username.p1Display,
    font.impact,
    {size: 0.18, resolution: 64,depth: 0.2},
    game.scene
  );
  game.p1NameText.material = material.whiteText;
  game.p1NameText.setEnabled(true);
  game.p1NameText.position = POS.nameP1;

  game.p2NameText = BABYLON.MeshBuilder.CreateText(
    "p2NameText",
    game.username.p2Display,
    font.impact,
    {size: 0.18, resolution: 64,depth: 0.2},
    game.scene
  );
  game.p2NameText.material = material.whiteText;
  game.p2NameText.setEnabled(true);
  game.p2NameText.position = POS.nameP2;

  if (game.hasThirdPlayer) {
    

    game.p3NameText = BABYLON.MeshBuilder.CreateText(
      "p3NameText",
      game.username.p3Display,
      font.impact,
      {size: 0.18, resolution: 64,depth: 0.2},
      game.scene
    );
    game.p3NameText.material = material.whiteText;
    game.p3NameText.rotation.y = -0.5;
    game.p3NameText.setEnabled(true);
    game.p3NameText.position = POS.nameP3;
  }
}

function createScoreText(game, POS, material, font) {
  const array = ["0", "1", "2", "3", "4", "5", "6", "7"];
  array.forEach((x) => {
      const scoreTextLeft = BABYLON.MeshBuilder.CreateText(
      "scoreTextLeft" + x,
      x,
      font.scoreboard,
      {size: 0.8, resolution: 64,depth: 0.5},
      game.scene
    );
    scoreTextLeft.material = material.scoreText;
    scoreTextLeft.rotation.x = 0;
    scoreTextLeft.setEnabled(false);
  
    const scoreTextRight = scoreTextLeft.clone("scoreTextRight" + x);
    
    scoreTextLeft.position = POS.scoreP1;
    scoreTextRight.position = POS.scoreP2;
  });
}

function createScoreboard(game, POS, material, font) {
  const scoreBoard = BABYLON.MeshBuilder.CreateBox("scoreBoard", {width: 3.5, height: 1.75, depth: 0.3}, game.scene);
  scoreBoard.position = POS.scoreboard;
  scoreBoard.material = material.scoreboard;
  scoreBoard.material.maxSimultaneousLights = 8;

  const leg1 = BABYLON.MeshBuilder.CreateBox("leg1", {width: 0.13, height: 0.5, depth: 0.13}, game.scene);
  leg1.position = POS.legLeft;
  leg1.material = material.scoreboard;

  const leg2 = BABYLON.MeshBuilder.CreateBox("leg2", {width: 0.13, height: 0.5, depth: 0.13}, game.scene);
  leg2.position = POS.legRight;
  leg2.material = material.scoreboard;
}

function createScoreboardP3(game, POS, material, font) {
  if (game.hasThirdPlayer) {
    const scoreboardP3 = BABYLON.MeshBuilder.CreateBox("POS.scoreboardP3", {width: 1.4, height: .7, depth: .25}, game.scene);
    scoreboardP3.position = POS.scoreboardP3;
    scoreboardP3.rotation.y = -0.5;
    scoreboardP3.material = material.scoreboard;
    scoreboardP3.material.maxSimultaneousLights = 8;

    const p3LegVec = new BABYLON.Vector3(-2.9, 0.5, 2.87);

    const p3Leg = BABYLON.MeshBuilder.CreateBox("p3Leg", {width: 0.13, height: 0.5, depth: 0.1}, game.scene);
    p3Leg.position = p3LegVec;
    p3Leg.rotation.y = -0.5;
    p3Leg.material = material.scoreboard;
  }
}

function createGameBoard(game, material) {
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, game.scene);
  ground.material = material.ground;
  
  var wallTop = BABYLON.MeshBuilder.CreateBox("wallTop", {width: 6, height: 0.2, depth: 0.2}, game.scene);
  wallTop.position.y = 0.1;
  wallTop.position.x = 0;
  wallTop.material = material.wall;
  
  var wallBottom = wallTop.clone("wallBottom");
  wallTop.position.z = 2.9;
  wallBottom.position.z = -2.9;
  
  var wallLeft = BABYLON.MeshBuilder.CreateBox("wallLeft", {width: 0.2, height: 0.2, depth: 6}, game.scene);
  wallLeft.position.y = 0.1;
  wallLeft.material = material.wall;
  
  var wallRight = wallLeft.clone("wallRight");
  wallLeft.position.x = -2.9;
  wallRight.position.x = 2.9;

  var centerLine = BABYLON.MeshBuilder.CreateBox("centerLine", {width: 0.1, height: 0.1, depth: 5.8}, game.scene);
  centerLine.position.y = -0.049;
  centerLine.position.z = 0;
  centerLine.material = material.paddle;
  
  var base = BABYLON.MeshBuilder.CreateBox("base", {width: 6, height: 60, depth: 6}, game.scene);
  base.position.y = -30;
  base.position.x = 0;
  base.material = material.wall;
}

function createSphere(game, material) {
  game.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.4, segments: 32}, game.scene);
  game.sphere.position.y = 0.2;
  game.sphere.material = material.sphere;
}

export async function createScene(game) {
  var font = {};
  var material = {};
  var POS = {};

  game.scene = new BABYLON.Scene(game.engine);
  game.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  font.scoreboard = await (await fetch("game/assets/Score_Board_Regular.json")).json();
  font.impact = await (await fetch("game/assets/Impact_Regular.json")).json();
  
  createCamera(game);
  createLights(game);
  createMaterial(game, material);
  createMeshPositions(POS);

  createPaddles(game, material);
  createGameBoard(game, material);
  createSphere(game, material);

  createScoreboard(game, POS, material, font);
  createPlayerNameText(game, POS, material, font);
  createScoreText(game, POS, material, font);
  createCountdownText(game, POS, material, font);
  createGameOverText(game, POS, material, font);
  createArrowText(game, POS, material, font);
  createScoreboardP3(game, POS, material, font);
  getKeyboardInput(game);
}
