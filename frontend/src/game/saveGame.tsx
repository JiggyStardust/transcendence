
export function saveGame(game, gameState, setGameWinner) {
  if (!game.infoSaved) {
    game.infoSaved = true;
    if (gameState.gameType === "tournament") {
      if (game.score.p1 === game.score.max )
        setGameWinner(gameState.gameNumber, gameState.players[0].displayName);
      else
        setGameWinner(gameState.gameNumber, gameState.players[1].displayName);
    }
  }
}
