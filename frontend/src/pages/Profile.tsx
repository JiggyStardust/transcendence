import MatchResultPie from "../components/PieChart";
import { useAppToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { PROXY_URL } from "../constants/";

interface IMatchHistoryData {
  matchId: number;    // I probably will not use this
  createdAt: string;  // "2025-12-16T15;31:12.680Z"
  isWinner: boolean;  // (is the main user a winner)
  userScore: number;  // (main users score)
  opponentScore: number;
  opponentDisplayName: string;
  opponentAvatarURL: string;
}

export default function Profile() {
  const { showToast } = useAppToast();
  const [matches, setMatches] = useState<IMatchHistoryData[]>([]);

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
        setMatches(data);
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

  // const wins = 6;
  // const losses = 3;

  return (
    <main className="p-12 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-semibold">Profile</h1>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl">Success in latest matches</h2>

        <MatchResultPie wins={wins} losses={losses} />

        <div className="flex gap-6 text-xl">
          <p className="text-green-500">Wins: {wins}</p>
          <p className="text-red-500">Losses: {losses}</p>
        </div>
      </div>
    </main>
  );
}
