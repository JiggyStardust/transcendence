
function truncate(str) {
  const maxLength = 9;
  if (str.length <= maxLength)
    return str;
  return str.slice(0, maxLength) + "...";
}

export function parseUsername(game) {
  game.username.p1Display = game.username.p1.toUpperCase();
  game.username.p1Display = truncate(game.username.p1Display);
  game.username.p2Display = game.username.p2.toUpperCase();
  game.username.p2Display = truncate(game.username.p2Display);
  if (game.hasThirdPlayer) {
    game.username.p3Display = game.username.p3.toUpperCase();
    game.username.p3Display = truncate(game.username.p3Display);
  }
}