import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { PROXY_URL } from "../constants";
import SearchUsers from "../components/SearchUsers.tsx";
import { mapFriendsList } from "../../src/adapters/friendsAdapter";
import type { UserPreview } from "../types/userTypes.ts";
import FriendshipButton from "../components/FriendshipButton.tsx";
import Stats from "../components/Stats.tsx";

const FriendRow = ({ friend }: { friend: UserPreview}) => {
	const imageUrl = friend.avatarUrl !== null ? "/api" + friend.avatarUrl : PROXY_URL + "/uploads/avatars/default.png";
	const onlineStatus = friend.presence === "ONLINE" ? "Online" : "Offline";
  return (
		<div className="flex justify-between items-center bg-stone-700/50 dark:bg-stone-600 rounded-xl p-4">
	    <li className="flex items-center gap-4 ">
	      <img
	        src={imageUrl}
	        alt={friend.name}
	        className="w-10 h-10 rounded-full object-cover"
	      />
	      <div className="flex flex-col">
	        <span className="font-medium">
	          {friend.name }
	        </span>
	        <span className="text-sm opacity-70">{onlineStatus}</span>
	      </div>
	    </li>
			<div className="">
				<FriendshipButton status={friend.relationship} userID={friend.id}/>
			</div>
		</div>
  );
};

interface FriendSectionProps {
  title: string;
  list: UserPreview[];
}

const FriendSection = ({ title, list }: FriendSectionProps) => {
  if (list.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-medium">{title}</h3>
      <ul className="flex flex-col gap-2">
        {list.map((friend) => (
          <FriendRow key={friend.id} friend={friend} />
        ))}
      </ul>
    </div>
  );
};

const getAllFriends = async () => {
	const res = await fetch(PROXY_URL + "/friends/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "Failed to load friends");
	}

	const list = await res.json();
	return (mapFriendsList(list.data));
};

const Friends = () => {
	const [friends, setFriends] = useState<{
	  accepted: UserPreview[];
	  incoming: UserPreview[];
	  outgoing: UserPreview[];
	}>({
	  accepted: [],
	  incoming: [],
	  outgoing: []
	});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res = await getAllFriends();
        setFriends(res);
      } catch (err: any) {
				console.log("Error in load friends.")
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFriends();
  }, []);

	return (
		<div className="relative flex flex-col items-center bg-stone-700/50 dark:bg-stone-500 rounded-3xl p-8 w-2/3 mb-20">
			{error && (
				<div className="rounded-3xl p-8 w-full max-w-3xl text-red-400">
	        {error ?? "Failed to load friends"}
	      </div>
			)}
			{loading && (
				<div className="rounded-3xl p-8 w-full max-w-3xl">
	        Loading friends...
	      </div>
			)}

			{!loading && !error && friends?.accepted.length === 0 && friends.incoming.length === 0 && friends.outgoing.length === 0 ? (
				<div className="rounded-3xl p-8 w-full max-w-3xl">
	        No friends
	      </div>
			) : friends && (
				<>
					<div className="relative flex flex-col rounded-3xl p-8 w-2/3">
			      <FriendSection title="Friends" list={friends.accepted} />
			      <FriendSection title="Incoming Requests" list={friends.incoming} />
			      <FriendSection title="Outgoing Requests" list={friends.outgoing} />
					</div>
				</>
			)}
			<SearchUsers />
		</div>
	)
}


const Profile = () => {
const [activeTab, setActiveTab] = useState("stats");
	const { users, loadMe } = useUser();
	useEffect(() => {
		loadMe();
	}, [loadMe]);

	const mainUser = Object.values(users)[0];
	const imageUrl = mainUser.avatarUrl !== null ? mainUser.avatarUrl : PROXY_URL + "/uploads/avatars/default.png";
	return (
		<div className="flex flex-col items-center gap-20">
			<div className="flex flex-col gap-8 items-center">
				<img className="w-40 h-40 rounded-full object-cover"
					src={imageUrl}
					alt={mainUser.username} />
				<div className="flex flex-col items-center">
					<p>Profile of</p>
					<h1 className="text-4xl font-tomorrow font-semibold underline decoration-vintage-yellow">
						{mainUser.username}
					</h1>
				</div>
			</div>
			<div className="flex flex-col gap-8 items-center w-full">
				<div className="flex gap-4">
					<Button size="lg" onClick={() => setActiveTab("stats")}>
						Stats
					</Button>
					<Button size="lg"  onClick={() => setActiveTab("friends")}>
						Friends
					</Button>
				</div>
				{activeTab === "stats" ? <Stats /> : <Friends />}
			</div>
		</div>
	)
}

export default Profile;