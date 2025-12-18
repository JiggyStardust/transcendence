import { ThemeToggle } from './ThemeToggle.tsx'
import { NavLink } from "react-router-dom";
import { cva } from "class-variance-authority";
import { useAuth } from '../context/AuthContext.tsx';

export const navLinkStyles = cva(
  "transition-colors font-semibold px-2 py-1", 
  {
    variants: {
      active: {
        true: "text-vintage-yellow dark:text-vintage-yellow font-extrabold",
        false: "font-normal",
      },
    }
  }
);

export default function NavBar() {
	const { isAuthenticated } = useAuth();

	return (
		<nav className="sticky top-0 px-6 py-3 mb-12 items-center flex justify-between bg-stone-600 dark:bg-zinc-900 max-w-screen z-100">
			<span className="text-lg font-extrabold font-tomorrow text-vintage-yellow">
				<NavLink to="/">Ping of Pongs</NavLink>
			</span>
			<div className="flex gap-5 items-center no-scrollbar overflow-x-auto">
				{isAuthenticated ? (
					<>
						<NavLink to="/players" className={({ isActive }) => navLinkStyles({ active: isActive })}>Players</NavLink>
						<NavLink to="/gameRedirect" className={({ isActive }) => navLinkStyles({ active: isActive })}>Game</NavLink>
						<NavLink to="/profile" className={({ isActive }) => navLinkStyles({ active: isActive })}>Profile</NavLink>
						<NavLink to="/settings" className={({ isActive }) => navLinkStyles({ active: isActive })}>Settings</NavLink>
					</>
				) : (
					<>
						<NavLink to="/login" className={({ isActive }) => navLinkStyles({ active: isActive })}>Log in</NavLink>
						<NavLink to="/signup" className={({ isActive }) => navLinkStyles({ active: isActive })}>Sign up</NavLink>
					</>
				)}
				<ThemeToggle />
			</div>
		</nav>
	);
}
