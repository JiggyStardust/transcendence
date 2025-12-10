import { create } from "zustand";

export interface User {
  username: string; // not sure if we need this at all
}

interface TournamentState {
  players: User[];		//shuffled array of logged in users
  currentMatchPlayers: User[] | null;
  winner: User | null;

  setPlayers: (players: User[]) => void;
  startMatch: (players: User[]) => void;
  reportWinner: (player: User) => void;
}

export const useTournamentStore = create<TournamentState>((set) => ({
  players: [],
  currentMatchPlayers: null,
  winner: null,

  setPlayers: (players) => set({ players }),
  startMatch: (players) => set({ currentMatchPlayers: players }),
  reportWinner: (winner) => set({ winner, currentMatchPlayers: null }),
}));
