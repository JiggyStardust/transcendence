import { useState, useEffect } from "react";
import { PROXY_URL } from "../constants/index.ts";
import FriendshipButton from "./FriendshipButton.tsx";
import { useAppToast } from "../context/ToastContext";
import { type UserPreview } from "../types/userTypes.ts";
import { mapSearchResultToUser } from "../adapters/userAdapter";
import { type ISearchResult } from "../types/backendTypes.ts";

interface SearchResponse {
  success: boolean;
  data: ISearchResult[];
}

export const searchUsers = async (query: string): Promise<SearchResponse> => {

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

const UserRow = ({ avatarUrl, id, name, relationship, presence} : UserPreview ) => {
	const imageUrl = avatarUrl !== null
	? "/api" + avatarUrl : PROXY_URL + "/uploads/avatars/default.png";
  const onlineStatus = presence === "ONLINE" ? "Online" : "Offline";
  return (
    <li className="flex items-center bg-stone-700/50 dark:bg-stone-600 justify-between gap-4 shadow rounded-xl p-4">
      <div className="flex items-center gap-2">
				<img
	        src={imageUrl}
	        alt={name}
	        className="w-10 h-10 rounded-full object-cover"
	      />
        <span className="font-tomorrow font-medium">{name}</span>
			</div>
			<div className="flex flex-col text-end gap-1">
				<FriendshipButton status={relationship} userID={id} />
      	<span className="text-sm opacity-70 font-bold mr-1">{onlineStatus}</span>
			</div>
    </li>
  );
};

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
	const { showToast } = useAppToast();

  useEffect(() => {
    if (!query) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await searchUsers(query);
				const mapped = res.data.map(mapSearchResultToUser);
        setResults(mapped);
      } catch (err: any) {
        showToast("Error: " + err.message, "error");
				setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex flex-col rounded-3xl p-8 w-full max-w-5xl gap-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-lg bg-stone-800/60 dark:bg-stone-700 placeholder:text-gray-200"
      />

      {loading && <p className="text-sm opacity-70">Searching...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <ul className="flex flex-col gap-2">
        {results.map((user) => (
          <UserRow avatarUrl={user.avatarUrl} id={user.id} name={user.name} relationship={user.relationship} presence={user.presence} />
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;