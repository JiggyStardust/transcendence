import { ThemeToggle } from "../components/ThemeToggle";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

export default function Landing() {
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-5xl font-bold mb-6">Welcome to</h1>
      <Logo />
      <ThemeToggle />
      <p className="mt-4 text-lg text-center max-w-md">
        An adaptation of the classic Atari game Pong. Sign up to create a player profile, or sign in if you already have one.
      </p>

      <div className="mt-6 space-x-4">
        <Button to="/signup" variant="secondary">
          Sign Up
        </Button>
        <Button to="/signin" variant="secondary">
          Sign In
        </Button>
      </div>

      <div className="mt-8">
        <img src="/images/game-screenshot.png" alt="A photo of our game" className="rounded-xl shadow-lg"/>
      </div>
    </div>
  );
}