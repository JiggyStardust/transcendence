
// @ts-nocheck


import { Button } from "../components/Button.tsx";
import { useState } from "react";

export interface User {
  username: string; // not sure if we need this at all
}

const Match = ({game_number, player_1, player_2, active=true}: {game_number: string, player_1: string, player_2:string, active: boolean}) => {
  return (
    <div className="flex justify-center gap-7">
      <Button to="/game" variant="primary" size="lg" disabled={!active}>{game_number}</Button>
      <p className="text-3xl">{player_1} vs. {player_2}</p>
    </div>
  )
}

export default function Tournament() {
  const [players, setPlayers] = useState<User[]>([
    { username: "Alice" },
    { username: "Bob" },
    { username: "Charlie" },
    { username: "Dana" }
  ]);
  const [winner_1, setWinner_1] = useState("Winner of Game 1");
  const [winner_2, setWinner_2] = useState("Winner of Game 2");

  players.sort( () => Math.random()-0.5 );


  
  return (
    <div className="flex justify-center flex-col items-center gap-10">
      <h1 className="mt-4 font-press text-7xl text-vintage-red dark:text-vintage-yellow [word-spacing:-30px] tracking-[-0.1em]">Tournament</h1>
      <div className="flex flex-col items-start gap-4">
        <Match
          game_number="Game 1"
          player_1={players[0].username}
          player_2={players[1].username}
        />
        <Match
          game_number="Game 2"
          player_1={players[2].username}
          player_2={players[3].username}
        />
        <Match
          game_number="Game 3"
          player_1={winner_1}
          player_2={winner_2}
          active={false}
        />
      </div>
    </div>
    
  )

}
