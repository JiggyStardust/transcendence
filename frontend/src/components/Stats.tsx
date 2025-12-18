import MatchResultPie from "./PieChart";
import MatchHistoryTable from "./MatchHistoryTable";
import { useAppToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { PROXY_URL } from "../constants";
import { type IMatchHistoryData } from "../types/backendTypes";

const Stats = () => {
  const { showToast } = useAppToast();
  const [matches, setMatches] = useState<IMatchHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const res = await fetch(`${PROXY_URL}/match_history`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Could not fetch match history");
        }

        const data: IMatchHistoryData[] = await res.json();
        setMatches(data);
      } catch (err) {
        showToast("Error: could not load match history", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchHistory();
  }, [showToast]);

  const wins = matches.filter(m => m.isWinner).length;
  const losses = matches.length - wins;

  return (
    <div className="relative flex flex-col bg-stone-700/50 dark:bg-stone-500 rounded-3xl p-8 w-2/3 gap-8">
      <h2 className="text-2xl font-semibold">Stats</h2>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl">Success in latest matches</h3>

            <MatchResultPie wins={wins} losses={losses} />

            <div className="flex gap-6 text-lg">
              <p className="text-blue-500">Wins: {wins}</p>
              <p className="text-orange-500">Losses: {losses}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl mt-6">Match History</h3>
            <MatchHistoryTable matches={matches} />
          </div>
        </>
      )}
    </div>
  );
};

export default Stats
