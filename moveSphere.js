export async function moveSphere(game, move) {
  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.sphere.position.addInPlace(move.direction.scale(move.ballSpeed * deltaTime));
}
