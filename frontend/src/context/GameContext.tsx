// @ts-nocheck

import { createContext, useContext, useState, ReactNode } from "react";

export type GameType = "regular" | "multiplayer" | "tournament";

export interface Player {
  id: string;
  displayName: string;
}

export interface GameState {
  gameType: GameType | null;
  players: Player[];
}

interface GameContextType {
  gameState: GameState;
  
  setGameType: (type: GameType) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  
  updateGameState: (data: Partial<GameState>) => void;
  clearGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const initialGameState: GameState = {
  gameType: null,
  players: [],
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  function updateGameState(data: Partial<GameState>) {
    setGameState((prev) => ({ ...prev, ...data }));
  }

  function setGameType(gameType: GameType) {
    updateGameState({ gameType });
  }

  function setPlayers(players: Player[]) {
    updateGameState({ players });
  }

  function addPlayer(player: Player) {
    setGameState((prev) => ({
      ...prev,
      players: [...prev.players, player],
    }));
  }

  function removePlayer(playerId: string) {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
  }

  function clearGame() {
    setGameState(initialGameState);
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameType,
        setPlayers,
        addPlayer,
        removePlayer,
        updateGameState,
        clearGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside a GameProvider");
  }
  return context;
}
