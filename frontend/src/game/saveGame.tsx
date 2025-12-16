// @ts-nocheck
export function saveGame(game, gameState, setGameWinner) {
  if (!game.infoSaved) {
    game.infoSaved = true;
    console.log("Save Game!");
    console.log("p1 id: ", gameState.players[0].id);
    console.log("p2 id: ", gameState.players[1].id);
    if (gameState.gameType === "tournament") {
      if (game.score.p1 === game.score.max )
        setGameWinner(gameState.gameNumber, gameState.players[0]);
      else
        setGameWinner(gameState.gameNumber, gameState.players[1]);
    }
  }
}
