import { ThemeToggle } from "../components/ThemeToggle";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

export default function Landing() {
  return (
    <div
      className="page-bg flex flex-col items-center justify-center min-h-screen w-screen text-gray-900 dark:text-white transition-colors duration-500">
      {/* if want to make bg animated, add animated-bg to className above and enable it in  */}
      {/* className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 animated-bg" */}
      <h1 className="font-[Chango] text-5xl font-bold font-style: italic mb-6">Welcome to</h1>
      <Logo size={9}/>
      <p className="mt-8 text-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-7">An adaptation of the classic Atari game Pong.</h2>
        <br></br><br></br> Sign up to create a player profile, or sign in if you already have one.
      </p>

      <div className="mt-6 space-x-4">
        <Button to="/signup" variant="primary">
          Sign Up
        </Button>
        <Button to="/signin" variant="primary">
          Sign In
        </Button>
      </div>
      <ThemeToggle />

      <div className="mt-8">
        <img src="/images/game-screenshot.png" alt="A photo of our game" className="rounded-xl shadow-lg"/>
      </div>
    </div>
  );
}