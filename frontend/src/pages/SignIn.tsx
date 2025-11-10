import { ThemeToggle } from "../components/ThemeToggle";

export default function SignIn() {
  return (
<div className="flex flex-col items-center justify-center min-h-screen w-screen">
	  <ThemeToggle />
	  <p className="mt-4 text-lg text-center max-w-md">
		This is where you SignIn!
	  </p>
	</div>
  );
}