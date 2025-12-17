

function truncate(str, maxLength) {
  if (str.length <= maxLength)
    return str;
  return str.slice(0, maxLength) + "...";
}

function reduceSize(str) {
  var count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === 'M' || str[i] === 'W')
        count++;
  }
  if (count < 4)
    return count;
  else
    return 4;
}

export function parseUsername(game, players) {
  const maxLength = 9;
  
  if (players.length >= 2) {
    game.username.p1 = players[0].displayName;
    game.username.p2 = players[1].displayName;
  }
  
  game.hasThirdPlayer = false;
  if (players.length >= 3) {
    game.username.p3 = players[2].displayName;
    game.hasThirdPlayer = true;
  }
  
  game.username.p1Display = game.username.p1.toUpperCase();
  game.username.p1Display = truncate(game.username.p1Display, maxLength - reduceSize(game.username.p1Display));
  game.username.p2Display = game.username.p2.toUpperCase();
  game.username.p2Display = truncate(game.username.p2Display, maxLength - reduceSize(game.username.p2Display));
  if (game.hasThirdPlayer) {
    game.username.p3Display = game.username.p3.toUpperCase();
    game.username.p3Display = truncate(game.username.p3Display, maxLength - reduceSize(game.username.p3Display));
  }
}
