
function increaseBallSpeed(game) {
  if (game.move.ballSpeed < game.move.maxBallSpeed)
    game.move.ballSpeed += game.move.ballSpeedIncrement;
}

function ballIsInLineWithPaddle(game, paddle) {
  if (paddle.position.z < game.sphere.position.z + (game.move.paddleColSize)
      && paddle.position.z > game.sphere.position.z - (game.move.paddleColSize))
    return true;
  return false;
}

function ballHitMiddleOfPaddle(game, paddle) {
  if (paddle.position.z < game.sphere.position.z + (game.move.paddleSize / 6)
        && paddle.position.z > game.sphere.position.z - (game.move.paddleSize / 6)) {
    return true;
  }
  return false;
}

function ballHitTopOfPaddle(game, paddle) {
  if (paddle.position.z < game.sphere.position.z)
      return true;
  return false;
}

function ballIsMovingUp(game) {
  if (game.move.direction.z > 0)
    return true;
  return false;
}

function ballIsMovingDown(game) {
  if (game.move.direction.z < 0)
    return true;
  return false;
}

function paddle1Collision(game) {
  if (game.sphere.position.x < -game.move.paddleCollisionX
        && game.move.direction.x < 0
        && ballIsInLineWithPaddle(game, game.paddle1)) {

    game.middlePaddleFlag = true;
    increaseBallSpeed(game);

    if (ballHitMiddleOfPaddle(game, game.paddle1))
      game.move.direction.x = -game.move.direction.x;
    else if (ballHitTopOfPaddle(game, game.paddle1)){
      if (ballIsMovingUp(game))
        game.move.direction.set(game.move.vxLarge, 0, game.move.vzLarge);
      else if (ballIsMovingDown(game)) {
        if (game.move.direction.x === game.move.vxSmall)
          game.move.direction.set(game.move.vxStraight, 0, game.move.vzStraight);
        else
          game.move.direction.set(game.move.vxSmall, 0, -game.move.vzSmall);
      }
      else
        game.move.direction.set(game.move.vxSmall, 0, game.move.vzSmall);
    }
    else {
      if (ballIsMovingUp(game)) {
        if (game.move.direction.x === game.move.vxLarge)
          game.move.direction.set(game.move.vxSmall, 0, game.move.vzSmall);
        else
          game.move.direction.set(game.move.vxStraight, 0, game.move.vzStraight);
      }
      else if (ballIsMovingDown(game))
        game.move.direction.set(game.move.vxLarge, 0, -game.move.vzLarge);
      else
        game.move.direction.set(game.move.vxSmall, 0, -game.move.vzSmall);
    }
  }
}

function paddle2Collision(game) {
  if (game.sphere.position.x > game.move.paddleCollisionX
        && game.move.direction.x > 0
        && ballIsInLineWithPaddle(game, game.paddle2)) {

    game.middlePaddleFlag = true;
    increaseBallSpeed(game);

    if (ballHitMiddleOfPaddle(game, game.paddle2))
      game.move.direction.x = -game.move.direction.x;
    else if (ballHitTopOfPaddle(game, game.paddle2)){
      if (ballIsMovingDown(game))
        game.move.direction.set(-game.move.vxLarge, 0, game.move.vzLarge);
      else if (ballIsMovingUp(game)) {
        if (game.move.direction.x === game.move.vxSmall)
          game.move.direction.set(-game.move.vxStraight, 0, game.move.vzStraight);
        else
          game.move.direction.set(-game.move.vxSmall, 0, -game.move.vzSmall);
      }
      else
        game.move.direction.set(-game.move.vxSmall, 0, game.move.vzSmall);
    }
    else {
      if (ballIsMovingUp(game)) {
        if (game.move.direction.x === game.move.vxLarge)
          game.move.direction.set(-game.move.vxSmall, 0, game.move.vzSmall);
        else
          game.move.direction.set(-game.move.vxStraight, 0, game.move.vzStraight);
      }
      else if (ballIsMovingDown(game))
        game.move.direction.set(-game.move.vxLarge, 0, -game.move.vzLarge);
      else
        game.move.direction.set(-game.move.vxSmall, 0, -game.move.vzSmall);
    }
  }
}

function sideCollision(game) {
  if (game.sphere.position.z > game.move.sideCollisionZ
            && game.move.direction.z > 0) {
    game.move.direction.z = -game.move.direction.z;
  }
  else if (game.sphere.position.z < -game.move.sideCollisionZ
            && game.move.direction.z < 0) {
    game.move.direction.z = -game.move.direction.z;
  }
}

function scoreCollision(game) {
  if (game.sphere.position.x > game.move.scoreCollisionX) {
    game.currentState = game.state.pointScored;
    game.score.p1++;
  }
  else if (game.sphere.position.x < -game.move.scoreCollisionX) {
    game.currentState = game.state.pointScored;
    game.score.p2++;
  }
}

function paddle3Collision(game) {
  const p3offset = 0.3;
  if (game.hasThirdPlayer 
          && game.paddle3.position.z < game.sphere.position.z + (game.move.paddle3ColSize)
          && game.paddle3.position.z > game.sphere.position.z - (game.move.paddle3ColSize)
          && game.middlePaddleFlag === true) {
    if (game.sphere.position.x >= -p3offset && game.sphere.position.x <= p3offset && game.move.direction.x > 0){
      game.move.direction.x = -game.move.direction.x;
      game.middlePaddleFlag = false;
    }
    else if (game.sphere.position.x <= p3offset && game.sphere.position.x >= -p3offset && game.move.direction.x < 0){
      game.move.direction.x = -game.move.direction.x;
      game.middlePaddleFlag = false;
    }
  }
}

export function applyCollision(game) {
  paddle1Collision(game);
  paddle2Collision(game);
  paddle3Collision(game);
  sideCollision(game);
  scoreCollision(game);
}
