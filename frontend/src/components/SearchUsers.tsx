import { useState, useEffect } from "react";
import type { ISearchResult } from "../../../backend/src/database/friends.ts"
import { PROXY_URL } from "../constants/index.ts";
import FriendshipButton from "./FriendshipButton.tsx";
import { useAppToast } from "../context/ToastContext";

interface SearchResponse {
  success: boolean;
  data: ISearchResult[];
}

export const searchFriends = async (query: string): Promise<SearchResponse> => {

	const res = await fetch(PROXY_URL + `/friends?search=${encodeURIComponent(query)}`, {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "Failed to search users");
	}

	return res.json();
};

const UserRow = ({ avatarURL, userID, displayName, friendshipStatus, status} : ISearchResult ) => {
	const imageUrl = avatarURL !== null
	? "/api" + avatarURL : PROXY_URL + "/uploads/avatars/default.png";
	console.log("Friend ID in user row: " + userID);
  return (
    <li className="flex items-center justify-between gap-4 border shadow rounded-xl p-4">
      <div className="flex items-center gap-2">
				<img
	        src={imageUrl}
	        alt={displayName}
	        className="w-10 h-10 rounded-full object-cover"
	      />
        <span className="font-tomorrow font-medium">{displayName}</span>
			</div>
			<div className="flex flex-col text-end">
				<FriendshipButton status={friendshipStatus} userID={userID} />
      	<span className="text-sm opacity-70">Online status: <span className="font-bold">{status}</span></span>
			</div>
    </li>
  );
};

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
	const { showToast } = useAppToast();

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!query) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await searchFriends(query);
        setResults(res.data);
      } catch (err: any) {
        showToast("Error: " + err.message, "error");
				setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col bg-stone-700/50 dark:bg-stone-500 rounded-3xl p-8 w-full max-w-3xl gap-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-lg bg-stone-800/50 dark:bg-stone-600 text-white placeholder:text-gray-400"
      />

      {loading && <p className="text-sm opacity-70">Searching...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <ul className="flex flex-col gap-2">
        {results.map((user) => (
          <UserRow avatarURL={user.avatarURL} userID={user.userID} displayName={user.displayName} friendshipStatus={user.friendshipStatus} status={user.status} />
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;