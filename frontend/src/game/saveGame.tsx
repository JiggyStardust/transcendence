// @ts-nocheck

export function saveGame(game, gameState) {
	if (!game.infoSaved) {
		game.infoSaved = true;
		console.log("Saving game...", game);
		console.log(gameState.gameNumber);
		
	}
}
