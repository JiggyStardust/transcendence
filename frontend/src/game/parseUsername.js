
function truncate(str) {
  const maxLength = 9;
  if (str.length <= maxLength)
    return str;
  return str.slice(0, maxLength) + "...";
}


export async function parseUsername(game) {
  game.username.p1Display = game.username.p1.toUpperCase();
  game.username.p2Display = game.username.p2.toUpperCase();
  game.username.p1Display = truncate(game.username.p1Display);
  game.username.p2Display = truncate(game.username.p2Display);
}