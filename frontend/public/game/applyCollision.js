
function increaseBallSpeed(game) {
  if (game.move.ballSpeed < game.move.maxBallSpeed)
    game.move.ballSpeed += game.move.ballSpeedIncrement;
}

function isInLineWithPaddle(game, paddle) {
  if (paddle.position.z < game.sphere.position.z + (game.move.paddleCollisionSize)
      && paddle.position.z > game.sphere.position.z - (game.move.paddleCollisionSize))
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
        game.move.direction.x = game.move.vxLargeAngle;
        game.move.direction.z = game.move.vzLargeAngle;
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        // SmallAngle
        if (game.move.direction.x === game.move.vxSmallAngle) {
          game.move.direction.x = game.move.vxStraightAngle;
          game.move.direction.z = game.move.vzStraightAngle;
        }
        // LargeAngle
        else {
          game.move.direction.x = game.move.vxSmallAngle;
          game.move.direction.z = -game.move.vzSmallAngle;
        }
      }
      // Sphere moving straight
      else {
        game.move.direction.x = game.move.vxSmallAngle;
        game.move.direction.z = game.move.vzSmallAngle;
      }
    }
    // Bottom of paddle
    else {
      // Sphere moving up
      if (game.move.direction.z > 0) {
        if (game.move.direction.x === game.move.vxLargeAngle) {
          game.move.direction.x = game.move.vxSmallAngle;
          game.move.direction.z = game.move.vzSmallAngle;
        }
        else {
          game.move.direction.x = game.move.vxStraightAngle;
          game.move.direction.z = game.move.vzStraightAngle;
        }
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        game.move.direction.x = game.move.vxLargeAngle;
        game.move.direction.z = -game.move.vzLargeAngle;
      }
      // Sphere moving straight
      else {
        game.move.direction.x = game.move.vxSmallAngle;
        game.move.direction.z = -game.move.vzSmallAngle;
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
        game.move.direction.x = -game.move.vxLargeAngle;
        game.move.direction.z = game.move.vzLargeAngle;
      }
      // Sphere moving up
      else if (game.move.direction.z < 0) {
        if (game.move.direction.x === game.move.vxSmallAngle) {
          game.move.direction.x = -game.move.vxStraightAngle;
          game.move.direction.z = game.move.vzStraightAngle;
        }
        else {
          game.move.direction.x = -game.move.vxSmallAngle;
          game.move.direction.z = -game.move.vzSmallAngle;
        }
      }
      // Sphere moving straight
      else {
        game.move.direction.x = -game.move.vxSmallAngle;
        game.move.direction.z = game.move.vzSmallAngle;
      }
    }
    // Bottom of paddle
    else {
      // Sphere moving up
      if (game.move.direction.z > 0) {
        if (game.move.direction.x === game.move.vxLargeAngle) {
          game.move.direction.x = -game.move.vxSmallAngle;
          game.move.direction.z = game.move.vzSmallAngle;
        }
        else {
          game.move.direction.x = -game.move.vxStraightAngle;
          game.move.direction.z = game.move.vzStraightAngle;
        }
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        game.move.direction.x = -game.move.vxLargeAngle;
        game.move.direction.z = -game.move.vzLargeAngle;
      }
      // Sphere moving straight
      else {
        game.move.direction.x = -game.move.vxSmallAngle;
        game.move.direction.z = -game.move.vzSmallAngle;
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
          && game.paddle3.position.z < game.sphere.position.z + (game.move.paddle3CollisionSize)
          && game.paddle3.position.z > game.sphere.position.z - (game.move.paddle3CollisionSize)
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