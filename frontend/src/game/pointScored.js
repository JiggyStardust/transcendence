export function pointScored(game) {
  game.move.ballSpeed = 0;
  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.pointScored.timer += deltaTime;
  if (game.pointScored.timer >= game.pointScored.interval) {
    game.pointScored.timer = 0;
    game.sphere.position.x = game.move.xStartingPos;
    game.sphere.position.z = game.move.zStartingPos;
    game.paddle1.position.z = 0;
    game.paddle2.position.z = 0;
    if (game.hasThirdPlayer)
      game.paddle3.position.z = game.move.p3StartingZ;
    if (game.score.p1 === game.score.max || game.score.p2 === game.score.max)
      game.currentState = game.state.gameOver;
    else 
      game.currentState = game.state.reset;
  }
}
