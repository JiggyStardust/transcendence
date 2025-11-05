import { ThemeToggle } from './ThemeToggle.tsx'
import { Link } from "react-router-dom";

export default function NavBar() {
	return (
		<nav className="sticky top-0 px-6 py-2 items-center flex justify-between bg-amber-500 w-screen">
			<span className="text-3xl font-extrabold" style={{ fontFamily: "'Honk', system-ui" }}>
				Ping of Pongs
			</span>
			<div className="flex gap-5 items-center">
				<Link to="/signup">Sign up</Link>
				<ThemeToggle />
			</div>
		</nav>
	);
}
