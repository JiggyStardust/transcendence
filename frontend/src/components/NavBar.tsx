import { ThemeToggle } from './ThemeToggle.tsx'
import { NavLink } from "react-router-dom";

const navLinkStyles = ({ isActive }) => ({
  color: isActive ? '#007bff' : '#333',
  textDecoration: isActive ? 'none' : 'underline',
  fontWeight: isActive ? 'bold' : 'normal',
  padding: '5px 10px'
});

export default function NavBar() {
	return (
		<nav className="sticky top-0 px-6 py-3 mb-12 items-center flex justify-between bg-[#ed2c9a] dark:bg-zinc-900 shadow-lg shadow-amber-400 w-screen">
			<span className="text-3xl font-extrabold" style={{ fontFamily: "'Honk', system-ui" }}>
				<NavLink to="/" style={navLinkStyles}>Ping of Pongs</NavLink>
			</span>
			<div className="flex gap-5 items-center">
				<NavLink to="/login" className={({ isActive }) => navLinkStyles({ active: isActive })}>Log in</NavLink>
				<NavLink to="/testing" className={({ isActive }) => navLinkStyles({ active: isActive })}>Testing</NavLink>
				<NavLink to="/game" className={({ isActive }) => navLinkStyles({ active: isActive })}>Game</NavLink>
				<ThemeToggle />
			</div>
		</nav>
	);
}