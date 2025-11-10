export async function moveSphere(game) {
  if (game.state != "playing" && game.state != "pointScored")
    return;

  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.sphere.position.addInPlace(game.move.direction.scale(game.move.ballSpeed * deltaTime));
}
