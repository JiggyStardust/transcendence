// @ts-nocheck
export function saveGame(game, gameState, setGameWinner) {
  if (!game.infoSaved) {
    game.infoSaved = true;
    console.log("Save Game!");
    if (gameState.gameType === "tournament") {
      const winner = game.score.p1 === game.score.max 
        ? gameState.players[0].displayName 
        : gameState.players[1].displayName;
      
      setGameWinner(gameState.gameNumber, winner);
      console.log("Winner that was set:", winner);
    }
  }
}
