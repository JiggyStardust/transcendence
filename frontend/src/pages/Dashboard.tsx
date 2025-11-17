import { ThemeToggle } from "../components/ThemeToggle";

export default function Dasboard() {
  return (
<div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
    <h1 className="font-[Honk] text-[120px]">Ping of Pongs</h1> 
	  <p className="mt-4 text-lg text-center max-w-md">
		Congratz, you Signed in succesfully!
	  </p>
	  <ThemeToggle />
	</div>
  );
}