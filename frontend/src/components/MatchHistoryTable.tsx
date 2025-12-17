import { type IMatchHistoryData } from "../types/types";
import { PROXY_URL } from "../constants";

type Props = {
  matches: IMatchHistoryData[];
};

export default function MatchHistoryTable({ matches }: Props) {
  // Sort matches by newest first
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="overflow-x-auto w-full">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Date</th>
            <th className="px-4 py-2 border border-gray-300">Opponent</th>
            <th className="px-4 py-2 border border-gray-300">Opponent Score</th>
            <th className="px-4 py-2 border border-gray-300">Winner</th>
            <th className="px-4 py-2 border border-gray-300">Your Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map(match => (
            <tr key={match.matchId} className="text-center">
              <td className="px-4 py-2 border border-gray-100">
                {new Date(match.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border border-gray-300 flex items-center justify-center gap-2">
                <img
                  src={`${PROXY_URL}${match.opponentAvatarUrl}`}
                  alt={`Avatar of ${match.opponentDisplayName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{match.opponentDisplayName}</span>
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {match.opponentScore}
              </td>
              <td className={`px-4 py-2 border border-gray-300 ${match.isWinner ? "text-green-500" : "text-red-500"}`}>
                {match.isWinner ? "You won" : "You lost"}
              </td>
              <td className="px-4 py-2 border border-gray-300">{match.userScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
