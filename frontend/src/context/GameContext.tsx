import { createContext, useContext, useState, ReactNode } from "react";

export type GameType = "regular" | "multiplayer" | "tournament";

export interface Player {
 id: string;
 displayName: string;
}

export interface GameState {
 gameType: GameType | null;
 players: Player[];
 gameNumber: number;
 game1Winner: string | null;
 game2Winner: string | null;
 game3Winner: string | null;
}

interface GameContextType {
 gameState: GameState;
  setGameType: (type: GameType) => void;
 setPlayers: (players: Player[]) => void;
 addPlayer: (player: Player) => void;
 removePlayer: (playerId: string) => void;
 clearPlayers: () => void;
 setGameNumber: (gameNumber: number) => void;
 setGameWinner: (gameNumber: 1 | 2 | 3, winner: string) => void;
  updateGameState: (data: Partial<GameState>) => void;
 clearGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const initialGameState: GameState = {
 gameType: null,
 players: [],
 gameNumber: 0,
 game1Winner: null,
 game2Winner: null,
 game3Winner: null,
};

export function GameProvider({ children }: { children: ReactNode }) {
 const [gameState, setGameState] = useState<GameState>(initialGameState);

 function updateGameState(data: Partial<GameState>) {
   setGameState((prev: GameState) => ({ ...prev, ...data }));
 }

 function setGameType(gameType: GameType) {
   updateGameState({ gameType });
 }

 function setPlayers(players: Player[]) {
   updateGameState({ players });
 }

 function addPlayer(player: Player) {
   setGameState((prev: GameState) => ({
     ...prev,
     players: [...prev.players, player],
   }));
 }

 function removePlayer(playerId: string) {
   setGameState((prev: GameState) => ({
     ...prev,
     players: prev.players.filter((p) => p.id !== playerId),
   }));
 }

 function clearPlayers() {
   updateGameState({ players: [] });
 }

 function setGameNumber(gameNumber: number) {
   updateGameState({ gameNumber });
 }

 function setGameWinner(gameNumber: 1 | 2 | 3, winner: string) {
   if (gameNumber === 1) {
     updateGameState({ game1Winner: winner });
   } else if (gameNumber === 2) {
     updateGameState({ game2Winner: winner });
   } else if (gameNumber === 3) {
     updateGameState({ game3Winner: winner });
   }
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
       clearPlayers,
       setGameNumber,
       setGameWinner,
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

