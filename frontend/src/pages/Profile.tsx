import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";

const Stats = () => {
	return (
		<div className="bg-blue-200 w-2/3">
			<h2>
				Friends
			</h2>
		</div>
	)
}

const Friends = () => {
	return (
		<div className="bg-red-200 w-2/3">
			<h2>
				Friends
			</h2>
		</div>
	)
}


const Profile = () => {
	const [statsOpen, setStatesOpen] = useState(true);
	const [friendsOpen, setFriendsOpen] = useState(false);
	const { users, loadMe } = useUser();
	useEffect(() => {
		loadMe();
	}, [loadMe]);

	const mainUser = Object.values(users)[0];
	return (
		<div className="flex flex-col items-center gap-20">
			<h1 className="text-4xl text-vintage-red dark:text-vintage-yellow">
				Profile of <span className="font-tomorrow font-semibold underline dark:decoration-vintage-red">{mainUser.username}</span>
			</h1>
			<div className="flex gap-4">
				<Button size="lg" onClick={() => setStatesOpen(!statsOpen)}>
					Stats
				</Button>
				<Button size="lg" onClick={() => setFriendsOpen(!friendsOpen)}>
					Friends
				</Button>
			</div>
			{statsOpen && (
				<Stats />
			)}
			{friendsOpen && (
				<Friends />
			)}
		</div>
	)
}

export default Profile;