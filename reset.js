function countdown(game) {
	
	game.countdownText1.setEnabled(false);
	game.countdownText2.setEnabled(false);
	game.countdownText3.setEnabled(false);
	
  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.countdown.timer -= deltaTime;
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
	game.countdown.timer = game.countdown.interval;
	return true;
  }

  return false;
}

export async function reset(game) {
	if (countdown(game)) {
    game.move.ballSpeed = game.move.startingBallSpeed;
		game.countdown.timer = game.countdown.interval;
    game.move.toggleDirection *= -1;
    game.move.direction = new BABYLON.Vector3(2.236 * game.move.toggleDirection, 0, 0);
		game.currentState = game.state.playing;
	}
}
