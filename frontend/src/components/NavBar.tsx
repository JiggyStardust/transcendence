import { ThemeToggle } from './ThemeToggle.tsx'
import { NavLink } from "react-router-dom";
import { cva } from "class-variance-authority";

export const navLinkStyles = cva(
  "transition-colors font-semibold px-2 py-1", 
  {
    variants: {
      active: {
        true: "text-vintage-yellow dark:text-vintage-yellow font-extrabold",
        false: "text-neutral-900 dark:text-white font-normal",
      },
    }
  }
);

export default function NavBar() {
	return (
		<nav className="sticky top-0 px-6 py-3 mb-12 items-center flex justify-between bg-stone-600 dark:bg-zinc-900 w-screen">
			<span className="text-lg font-extrabold font-tomorrow text-vintage-yellow">
				<NavLink to="/">Ping of Pongs</NavLink>
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