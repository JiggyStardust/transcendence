
export function applyCollision(game) {
  // Paddle1 Collision
  if (game.sphere.position.x < -game.move.paddleCollisionX
          && game.paddle1.position.z < game.sphere.position.z + (game.move.paddleCollisionSize)
          && game.paddle1.position.z > game.sphere.position.z - (game.move.paddleCollisionSize)
          && game.move.direction.x < 0) {
    if (game.move.ballSpeed < game.move.maxBallSpeed)
      game.move.ballSpeed += game.move.ballSpeedIncrement;
    if (game.paddle1.position.z < game.sphere.position.z + (game.move.paddleSize / 6)
          && game.paddle1.position.z > game.sphere.position.z - (game.move.paddleSize / 6)) {
      // Middle of paddle
      game.move.direction.x = -game.move.direction.x;
    }
    else if (game.paddle1.position.z < game.sphere.position.z){
      // Top of paddle
      // Sphere moving up
      if (game.move.direction.z > 0) {
        game.move.direction.x = game.move.vxLargeAngle;
        game.move.direction.z = game.move.vzLargeAngle;
      }
      // Sphere moving down
      else if (game.move.direction.z < 0) {
        // SmallAngle
        if (game.move.direction.x == game.move.vxSmallAngle) {
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
    else {
      // Bottom of paddle
      if (game.move.direction.z > 0) {
        if (game.move.direction.x == game.move.vxLargeAngle) {
          game.move.direction.x = game.move.vxSmallAngle;
          game.move.direction.z = game.move.vzSmallAngle;
        }
        else {
          game.move.direction.x = game.move.vxStraightAngle;
          game.move.direction.z = game.move.vzStraightAngle;
        }
      }
      else if (game.move.direction.z < 0) {
        game.move.direction.x = game.move.vxLargeAngle;
        game.move.direction.z = -game.move.vzLargeAngle;
      }
      else {
        game.move.direction.x = game.move.vxSmallAngle;
        game.move.direction.z = -game.move.vzSmallAngle;
      }
    }
  }
  // Paddle2 Collision
  else if (game.sphere.position.x > game.move.paddleCollisionX
          && game.paddle2.position.z < game.sphere.position.z + (game.move.paddleCollisionSize)
          && game.paddle2.position.z > game.sphere.position.z - (game.move.paddleCollisionSize)
          && game.move.direction.x > 0) {
    if (game.move.ballSpeed < game.move.maxBallSpeed)
      game.move.ballSpeed += game.move.ballSpeedIncrement;
    if (game.paddle2.position.z < game.sphere.position.z + (game.move.paddleSize / 6)
          && game.paddle2.position.z > game.sphere.position.z - (game.move.paddleSize / 6)) {
      // Middle of paddle
      game.move.direction.x = -game.move.direction.x;
    }
    else if (game.paddle2.position.z < game.sphere.position.z){
      // Top of paddle
      // Sphere moving down
      if (game.move.direction.z > 0) {
        game.move.direction.x = -game.move.vxLargeAngle;
        game.move.direction.z = game.move.vzLargeAngle;
      }
      // Sphere moving up
      else if (game.move.direction.z < 0) {
        if (game.move.direction.x == game.move.vxSmallAngle) {
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
    else {
      // Bottom of paddle
      // Sphere moving up
      if (game.move.direction.z > 0) {
        if (game.move.direction.x == game.move.vxLargeAngle) {
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
}