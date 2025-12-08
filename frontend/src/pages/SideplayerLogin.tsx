import { Button } from "../components/Button";
import pongImg from "../assets/pong-thumbnail.png";
import { IoMdPersonAdd } from "react-icons/io";

export default function SideplayerLogin() {
	return (
		<div className="flex flex-col gap-15 items-center min-h-screen text-center transition-colors duration-500">
			<h1 className="mt-4 font-press text-7xl text-vintage-red dark:text-vintage-yellow [word-spacing:-30px] tracking-[-0.1em]">Ping of Pongs</h1>
			<div className="space-x-4 flex align-center">
					  <p className="mt-4 text-lg text-center max-w-md">
						This is where you login as a side player, as the main user has already logged in!
	  </p>
			</div>
		</div>
	);
}