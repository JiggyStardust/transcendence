
export async function applyCollision(game, move) {
  // Paddle1
  if (game.sphere.position.x < -move.paddleCollisionX
          && game.paddle1.position.z < game.sphere.position.z + (move.paddleCollisionSize)
          && game.paddle1.position.z > game.sphere.position.z - (move.paddleCollisionSize)
          && move.direction.x < 0) {
    if (move.ballSpeed < move.maxBallSpeed)
      move.ballSpeed += move.ballSpeedIncrement;
    if (game.paddle1.position.z < game.sphere.position.z + (move.paddleSize / 6)
          && game.paddle1.position.z > game.sphere.position.z - (move.paddleSize / 6)) {
      console.log("middle");
      move.direction.x = -move.direction.x;
    }
    else if (game.paddle1.position.z < game.sphere.position.z){
      console.log("top");
      // Sphere moving up
      if (move.direction.z > 0) {
        move.direction.x = move.vxLargeAngle;
        move.direction.z = move.vzLargeAngle;
      }
      // Sphere moving down
      else if (move.direction.z < 0) {
        // SmallAngle
        if (move.direction.x == move.vxSmallAngle) {
          move.direction.x = move.vxStraightAngle;
          move.direction.z = move.vzStraightAngle;
        }
        // LargeAngle
        else {
          move.direction.x = move.vxSmallAngle;
          move.direction.z = -move.vzSmallAngle;
        }
      }
      // Sphere moving straight
      else {
        move.direction.x = move.vxSmallAngle;
        move.direction.z = move.vzSmallAngle;
      }
    }
    else {
      console.log("bottom");
      if (move.direction.z > 0) {
        if (move.direction.x == move.vxLargeAngle) {
          move.direction.x = move.vxSmallAngle;
          move.direction.z = move.vzSmallAngle;
        }
        else {
          move.direction.x = move.vxStraightAngle;
          move.direction.z = move.vzStraightAngle;
        }
      }
      else if (move.direction.z < 0) {
        move.direction.x = move.vxLargeAngle;
        move.direction.z = -move.vzLargeAngle;
      }
      else {
        move.direction.x = move.vxSmallAngle;
        move.direction.z = -move.vzSmallAngle;
      }
    }
    console.log(move.direction.x + " " + move.direction.z);
  }
  // Paddle2
  else if (game.sphere.position.x > move.paddleCollisionX
          && game.paddle2.position.z < game.sphere.position.z + (move.paddleCollisionSize)
          && game.paddle2.position.z > game.sphere.position.z - (move.paddleCollisionSize)
          && move.direction.x > 0) {
    if (move.ballSpeed < move.maxBallSpeed)
      move.ballSpeed += move.ballSpeedIncrement;
    if (game.paddle2.position.z < game.sphere.position.z + (move.paddleSize / 6)
          && game.paddle2.position.z > game.sphere.position.z - (move.paddleSize / 6)) {
      console.log("middle");
      move.direction.x = -move.direction.x;
    }
    else if (game.paddle2.position.z < game.sphere.position.z){
      console.log("top");
      // Down
      if (move.direction.z > 0) {
        move.direction.x = -move.vxLargeAngle;
        move.direction.z = move.vzLargeAngle;
      }
      // Up
      else if (move.direction.z < 0) {
        if (move.direction.x == move.vxSmallAngle) {
          move.direction.x = -move.vxStraightAngle;
          move.direction.z = move.vzStraightAngle;
        }
        else {
          move.direction.x = -move.vxSmallAngle;
          move.direction.z = -move.vzSmallAngle;
        }
      }
      // Mid
      else {
        move.direction.x = -move.vxSmallAngle;
        move.direction.z = move.vzSmallAngle;
      }
    }
    else {
      console.log("bottom");
      // Up
      if (move.direction.z > 0) {
        if (move.direction.x == move.vxLargeAngle) {
          move.direction.x = -move.vxSmallAngle;
          move.direction.z = move.vzSmallAngle;
        }
        else {
          move.direction.x = -move.vxStraightAngle;
          move.direction.z = move.vzStraightAngle;
        }
      }
      // Down
      else if (move.direction.z < 0) {
        move.direction.x = -move.vxLargeAngle;
        move.direction.z = -move.vzLargeAngle;
      }
      // Mid
      else {
        move.direction.x = -move.vxSmallAngle;
        move.direction.z = -move.vzSmallAngle;
      }
    }
    
  }
  // Sides
  else if (game.sphere.position.z > move.sideCollisionZ && move.direction.z > 0) {
    move.direction.z = -move.direction.z;
  }
  else if (game.sphere.position.z < -move.sideCollisionZ && move.direction.z < 0) {
    move.direction.z = -move.direction.z;
  }
  // Scoring
  else if (game.sphere.position.x > move.scoreCollisionX) {
    move.direction.x = -move.direction.x;
    game.sphere.position.x = move.xStartingPosition;
    game.sphere.position.z = move.zStartingPosition;
    move.ballSpeed = move.startingBallSpeed;
    move.direction = new BABYLON.Vector3(move.xStartingAngle, 0, move.zStartingAngle);
    game.scoreP1++;
  }
  else if (game.sphere.position.x < -move.scoreCollisionX) {
    move.direction.x = -move.direction.x;
    game.sphere.position.x = move.xStartingPosition;
    game.sphere.position.z = move.zStartingPosition;
    move.ballSpeed = move.startingBallSpeed;
    move.direction = new BABYLON.Vector3(move.xStartingAngle, 0, move.zStartingAngle);
    game.scoreP2++;
  }
  return;
}