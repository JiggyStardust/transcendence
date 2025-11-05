import { ThemeToggle } from "../components/ThemeToggle";
import { Logo } from "../components/Logo";

export default function SignIn() {
  return (
<div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
	  <Logo />
	  <ThemeToggle />
	  <p className="mt-4 text-lg text-center max-w-md">
		This is where you SignIn!
	  </p>
	</div>
  );
}