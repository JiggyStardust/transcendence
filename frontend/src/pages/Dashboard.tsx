import { ThemeToggle } from "../components/ThemeToggle";

export default function Dasboard() {
  return (
<div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
	  <p className="mt-4 text-lg text-center max-w-md">
		Congratz, your Sign up was succesfull!
	  </p>
	  <ThemeToggle />
	</div>
  );
}