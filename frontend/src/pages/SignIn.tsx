import { ThemeToggle } from "../components/ThemeToggle";
import { Logo } from "../components/Logo";

export default function SignIn() {
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
	style={{
        background: `linear-gradient(to bottom, var(--bg-start) 0%, var(--bg-end) var(--bg-shift))`,
      }}>
	  <Logo />
	  <ThemeToggle />
	  <p className="mt-4 text-lg text-center max-w-md">
		This is where you SignIn!
	  </p>
	</div>
  );
}