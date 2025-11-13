function countdown(game) {
	
	game.countdownText1.setEnabled(false);
	game.countdownText2.setEnabled(false);
	game.countdownText3.setEnabled(false);
	
  // Timer
  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.reset.timer -= deltaTime;
  if (game.reset.timer > 2) {
    game.countdownText3.setEnabled(true);
  }
  else if (game.reset.timer > 1) {
    game.countdownText2.setEnabled(true);
  }
  else if (game.reset.timer > 0) {
    game.countdownText1.setEnabled(true);
  }

  // Arrow





  // Return true when countdown complete
  if (game.reset.timer < 0) {
    game.reset.timer = game.reset.interval;
    game.arrowLineText.setEnabled(false);
    game.arrowRightText.setEnabled(false);
    game.arrowLeftText.setEnabled(false);
    return true;
  }
  return false;
}

export async function reset(game) {
  if (game.reset.complete == false) {
    game.move.ballSpeed = game.move.startingBallSpeed;
    game.reset.timer = game.reset.interval;
    game.move.toggleDirection *= -1;
    game.move.direction = new BABYLON.Vector3(2.236 * game.move.toggleDirection, 0, 0);


    game.arrowLineText.setEnabled(true);
    if (game.move.toggleDirection == 1) {
      game.arrowRightText.setEnabled(true);
    }
    else {
      game.arrowLeftText.setEnabled(true);
    }
    
    game.reset.complete = true;
  }
	if (countdown(game)) {
    game.arrowLineText.setEnabled(false);
    game.arrowRightText.setEnabled(false);
    game.arrowLeftText.setEnabled(false);
    game.reset.complete = false;
		game.currentState = game.state.playing;
	}
}
