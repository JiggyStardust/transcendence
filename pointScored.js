export async function pointScored(game) {
  if (game.state != "pointScored")
      return;
  game.move.ballSpeed = 0;
  game.state = "resetBoard";
}
