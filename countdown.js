export async function countdown(game) {

  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.countdown.timer -= deltaTime;

  game.countdownText1.setEnabled(false);
  game.countdownText2.setEnabled(false);
  game.countdownText3.setEnabled(false);

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
