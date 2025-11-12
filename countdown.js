export async function countdown(game) {

  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.countdown.timer -= deltaTime;

  game.countdownText1.setEnabled(false);
  game.countdownText2.setEnabled(false);
  game.countdownText3.setEnabled(false);

  game.camera.position.z = game.currentCameraZ;
  if (game.currentCameraZ > -6)
    game.currentCameraZ -= deltaTime * 3;
  //game.camera.setTarget(BABYLON.Vector3.Zero());

  if (game.countdown.timer > 2) {
    game.countdownText3.setEnabled(true);
  }
  else if (game.countdown.timer > 1) {
    game.countdownText2.setEnabled(true);
  }
  else if (game.countdown.timer > 0) {
    game.countdownText1.setEnabled(true);
  }

  if (game.countdown.timer < 0) {
    game.currentState = game.state.playing;
    game.move.ballSpeed = game.move.startingBallSpeed;
    game.countdown.timer = game.countdown.interval;
  }
}
