import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/Button";

export default function Landing() {
  return (
    <div className=" flex flex-col gap-8 items-center justify-center min-h-screen text-center transition-colors duration-500">
      {/* if want to make bg animated, add animated-bg to className above and enable it in  */}
      {/* className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 animated-bg" */}
      <h1 className="font-[Chango] text-5xl font-bold font-style: italic">Welcome to</h1>
      <h1 className="logo text-[120px]">Ping of Pongs</h1>
	  <h2 className="text-2xl font-bold">An adaptation of the classic Atari game Pong.</h2>
	  <p>Sign up to create a player profile, or sign in if you already have one.</p>
      <div className="space-x-4">
        <Button to="/signup" variant="primary">
          Sign Up
        </Button>
        <Button to="/signin" variant="primary">
          Sign In
        </Button>
      </div>
      <ThemeToggle />

      <div className="">
        <img src="/images/game-screenshot.png" alt="A photo of our game" className="rounded-xl shadow-lg"/>
      </div>
    </div>
  );
}