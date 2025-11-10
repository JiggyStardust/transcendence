
export async function applyCollision(sphere, move, paddle1, paddle2) {
  // Paddle1
  if (sphere.position.x < -move.paddleCollisionX
          && paddle1.position.z < sphere.position.z + (move.paddleCollisionSize)
          && paddle1.position.z > sphere.position.z - (move.paddleCollisionSize)
          && move.direction.x < 0) {
    if (move.ballSpeed < move.maxBallSpeed)
      move.ballSpeed += move.ballSpeedIncrement;
    if (paddle1.position.z < sphere.position.z + (move.paddleSize / 6)
          && paddle1.position.z > sphere.position.z - (move.paddleSize / 6)) {
      console.log("middle");
      move.direction.x = -move.direction.x;
    }
    else if (paddle1.position.z < sphere.position.z){
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
  else if (sphere.position.x > move.paddleCollisionX
          && paddle2.position.z < sphere.position.z + (move.paddleCollisionSize)
          && paddle2.position.z > sphere.position.z - (move.paddleCollisionSize)
          && move.direction.x > 0) {
    if (move.ballSpeed < move.maxBallSpeed)
      move.ballSpeed += move.ballSpeedIncrement;
    if (paddle2.position.z < sphere.position.z + (move.paddleSize / 6)
          && paddle2.position.z > sphere.position.z - (move.paddleSize / 6)) {
      console.log("middle");
      move.direction.x = -move.direction.x;
    }
    else if (paddle2.position.z < sphere.position.z){
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
  else if (sphere.position.z > move.sideCollisionZ && move.direction.z > 0) {
    move.direction.z = -move.direction.z;
  }
  else if (sphere.position.z < -move.sideCollisionZ && move.direction.z < 0) {
    move.direction.z = -move.direction.z;
  }
  // Scoring
  else if (sphere.position.x > move.scoreCollisionX) {
    move.direction.x = -move.direction.x;
    sphere.position.x = move.xStartingPosition;
    sphere.position.z = move.zStartingPosition;
    move.ballSpeed = move.startingBallSpeed;
    move.direction = new BABYLON.Vector3(move.xStartingAngle, 0, move.zStartingAngle);
    scoreP1++;
  }
  else if (sphere.position.x < -move.scoreCollisionX) {
    move.direction.x = -move.direction.x;
    sphere.position.x = move.xStartingPosition;
    sphere.position.z = move.zStartingPosition;
    move.ballSpeed = move.startingBallSpeed;
    move.direction = new BABYLON.Vector3(move.xStartingAngle, 0, move.zStartingAngle);
    scoreP2++;
  }
  return;
}