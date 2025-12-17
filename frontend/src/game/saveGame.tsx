// @ts-nocheck

import { PROXY_URL } from "../constants";

export async function saveGame(game, gameState, setGameWinner) {
  if (!game.infoSaved) {
    game.infoSaved = true;
    // Save tournament results to gameContext
    if (gameState.gameType === "tournament") {
      if (game.score.p1 === game.score.max )
        setGameWinner(gameState.gameNumber, gameState.players[0].displayName);
      else
        setGameWinner(gameState.gameNumber, gameState.players[1].displayName);
    }
    
    var p1win = false;
    var p2win = false;

    if (game.score.p1 === game.score.max)
      p1win = true;
    else
      p2win = true;

    const payload = {
      userIds: [
        gameState.players[0].id,
        gameState.players[1].id
      ],
      scores: [
        game.score.p1,
        game.score.p2
      ],
      winner: [
        p1win,
        p2win
      ]
    };

    // Save match results to backend
    await fetch(PROXY_URL + "/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });
  }
}
