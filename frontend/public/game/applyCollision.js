
function increaseBallSpeed(game) {
  if (game.move.ballSpeed < game.move.maxBallSpeed)
    game.move.ballSpeed += game.move.ballSpeedIncrement;
}

function isInLineWithPaddle(game, paddle) {
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

export function applyCollision(game) {
  // Paddle1 Collision
  if (game.sphere.position.x < -game.move.paddleCollisionX
          && isInLineWithPaddle(game, game.paddle1)
          && game.move.direction.x < 0) {

    game.middlePaddleFlag = true;
    increaseBallSpeed(game);

    if (ballHitMiddleOfPaddle(game, game.paddle1))
      game.move.direction.x = -game.move.direction.x;
    else if (ballHitTopOfPaddle(game, game.paddle1)){
      // Sphere moving up
      if (game.move.direction.z > 0) {
        game.move.direction.x = game.move.vxLarge;
        game.move.direction.z = game.move.vzLarge;
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        // SmallAngle
        if (game.move.direction.x === game.move.vxSmall) {
          game.move.direction.x = game.move.vxStraight;
          game.move.direction.z = game.move.vzStraight;
        }
        // LargeAngle
        else {
          game.move.direction.x = game.move.vxSmall;
          game.move.direction.z = -game.move.vzSmall;
        }
      }
      // Sphere moving straight
      else {
        game.move.direction.x = game.move.vxSmall;
        game.move.direction.z = game.move.vzSmall;
      }
    }
    // Bottom of paddle
    else {
      // Sphere moving up
      if (game.move.direction.z > 0) {
        if (game.move.direction.x === game.move.vxLarge) {
          game.move.direction.x = game.move.vxSmall;
          game.move.direction.z = game.move.vzSmall;
        }
        else {
          game.move.direction.x = game.move.vxStraight;
          game.move.direction.z = game.move.vzStraight;
        }
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        game.move.direction.x = game.move.vxLarge;
        game.move.direction.z = -game.move.vzLarge;
      }
      // Sphere moving straight
      else {
        game.move.direction.x = game.move.vxSmall;
        game.move.direction.z = -game.move.vzSmall;
      }
    }
  }
  // Paddle2 Collision
  else if (game.sphere.position.x > game.move.paddleCollisionX
          && isInLineWithPaddle(game, game.paddle2)
          && game.move.direction.x > 0) {

    game.middlePaddleFlag = true;
    increaseBallSpeed(game);

    if (ballHitMiddleOfPaddle(game, game.paddle2))
      game.move.direction.x = -game.move.direction.x;
    else if (ballHitTopOfPaddle(game, game.paddle2)){
      // Sphere moving down
      if (game.move.direction.z > 0) {
        game.move.direction.x = -game.move.vxLarge;
        game.move.direction.z = game.move.vzLarge;
      }
      // Sphere moving up
      else if (game.move.direction.z < 0) {
        if (game.move.direction.x === game.move.vxSmall) {
          game.move.direction.x = -game.move.vxStraight;
          game.move.direction.z = game.move.vzStraight;
        }
        else {
          game.move.direction.x = -game.move.vxSmall;
          game.move.direction.z = -game.move.vzSmall;
        }
      }
      // Sphere moving straight
      else {
        game.move.direction.x = -game.move.vxSmall;
        game.move.direction.z = game.move.vzSmall;
      }
    }
    // Bottom of paddle
    else {
      // Sphere moving up
      if (game.move.direction.z > 0) {
        if (game.move.direction.x === game.move.vxLarge) {
          game.move.direction.x = -game.move.vxSmall;
          game.move.direction.z = game.move.vzSmall;
        }
        else {
          game.move.direction.x = -game.move.vxStraight;
          game.move.direction.z = game.move.vzStraight;
        }
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        game.move.direction.x = -game.move.vxLarge;
        game.move.direction.z = -game.move.vzLarge;
      }
      // Sphere moving straight
      else {
        game.move.direction.x = -game.move.vxSmall;
        game.move.direction.z = -game.move.vzSmall;
      }
    }
  }

  // Side Collision
  else if (game.sphere.position.z > game.move.sideCollisionZ
            && game.move.direction.z > 0) {
    game.move.direction.z = -game.move.direction.z;
  }
  else if (game.sphere.position.z < -game.move.sideCollisionZ
            && game.move.direction.z < 0) {
    game.move.direction.z = -game.move.direction.z;
  }

  // Scoring Collision
  else if (game.sphere.position.x > game.move.scoreCollisionX) {
    game.currentState = game.state.pointScored;
    game.score.p1++;
  }
  else if (game.sphere.position.x < -game.move.scoreCollisionX) {
    game.currentState = game.state.pointScored;
    game.score.p2++;
  }

  // Paddle 3
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