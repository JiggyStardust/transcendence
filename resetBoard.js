export async function resetBoard(game) {
  if (game.state != "resetBoard")
      return;
  game.sphere.position.x = game.move.xStartingPosition;
  game.sphere.position.z = game.move.zStartingPosition;
}
