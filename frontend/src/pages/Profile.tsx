import MatchResultPie from "../components/PieChart";
import { useAppToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { PROXY_URL } from "../constants/";
import { type IMatchHistoryData } from "../types/types";
import MatchHistoryTable from "../components/MatchHistoryTable";

export default function Profile() {
  const { showToast } = useAppToast();
  const [ matches, setMatches] = useState<IMatchHistoryData[]>([]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const res = await fetch(`${PROXY_URL}/match_history`, {
          credentials: "include",
        });

        if (!res.ok) {
          showToast("Error: could not fetch match history", "error"); // shows twice because of strict mode
        }

        const data: IMatchHistoryData[] = await res.json();
        if (!data){
          showToast("Error: could not load match history", "error");  
        }
        setMatches(data);
        console.log("data: ", data);

        showToast("Success: loading match history", "success"); // just for me now that database still empty
      } catch (error) {
        showToast("Error: could not load match history", "error"); // shows twice because of strict mode
      }
    };

    fetchMatchHistory();
  }, [showToast]);

  // Count wins/losses
  const wins = matches.filter(m => m.isWinner).length;
  const losses = matches.length - wins;


  return (
    <main className="p-12 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-semibold">Profile</h1>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl">Success in latest matches</h2>

        <MatchResultPie wins={wins} losses={losses} />

        <div className="flex gap-6 text-xl">
          <p className="text-blue-500">Wins: {wins}</p>
          <p className="text-orange-500">Losses: {losses}</p>
        </div>
        <h2 className="text-xl mt-8">Match History</h2>
        <MatchHistoryTable matches={matches} />

      </div>
    </main>
  );
}
