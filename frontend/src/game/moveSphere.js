export function moveSphere(game) {
  const deltaTime = game.engine.getDeltaTime() / 1000;
  game.sphere.position.addInPlace(game.move.direction.scale(game.move.ballSpeed * deltaTime));
}
