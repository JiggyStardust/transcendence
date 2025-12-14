// @ts-nocheck
export function saveGame(game, gameState, setGameWinner) {
  if (!game.infoSaved) {
    game.infoSaved = true;

    if (gameState.gameType === "tournament") {
      const winner = game.score.p1 === game.score.max 
        ? gameState.players[0] 
        : gameState.players[1];
      
      setGameWinner(gameState.gameNumber, winner);
      console.log("Winner that was set:", winner);
    }
  }
}
