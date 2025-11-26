import { ThemeToggle } from './ThemeToggle.tsx'
import { NavLink } from "react-router-dom";
import { cva } from "class-variance-authority";

export const navLinkStyles = cva(
  "transition-colors font-semibold px-2 py-1", 
  {
    variants: {
      active: {
        true: "text-black dark:text-pink-600 underline font-extrabold",
        false: "text-neutral-800 dark:text-white font-normal",
      },
    }
  }
);

export default function NavBar() {
	return (
		<nav className="sticky top-0 px-6 py-3 mb-12 items-center flex justify-between bg-[#ed2c9a] dark:bg-zinc-900 w-screen">
			<span className="text-3xl font-extrabold" style={{ fontFamily: "'Honk', system-ui" }}>
				<NavLink to="/">Ping of Pongs</NavLink>
			</span>
			<div className="flex gap-5 items-center">
				<NavLink to="/signup" className={({ isActive }) => navLinkStyles({ active: isActive })}>Sign up</NavLink>
				<NavLink to="/testing" className={({ isActive }) => navLinkStyles({ active: isActive })}>Testing</NavLink>
				<ThemeToggle />
			</div>
		</nav>
	);
}