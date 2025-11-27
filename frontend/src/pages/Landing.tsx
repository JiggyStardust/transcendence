import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/Button";
import pongImg from "../assets/pong-thumbnail.png";
import { IoMdPersonAdd } from "react-icons/io";
import Game from "./Game.tsx";

export default function Landing() {
  return (
    <div className="flex flex-col gap-8 p-16 items-center min-h-screen text-center transition-colors duration-500">
      {/* if want to make bg animated, add animated-bg to className above and enable it in  */}
      {/* className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 animated-bg" */}
      <h1 className="font-press-start text-7xl text-red-700 dark:text-[#e3cc98] tracking-[-0.1em]">Ping of Pongs</h1>	    <img src={ pongImg } alt="A photo of our game" className="rounded-xl shadow-lg w-1/3"/>
      <div className="space-x-4 flex align-center">
        <Button to="/signup" variant="secondary">
          <IoMdPersonAdd className="text-red-700" /> Sign Up
        </Button>
        <Button to="/signin" variant="primary">
          Sign In
        </Button>
        <Button to="/testing">
          Testing
        </Button>
        <Button to="/game">
          Game
        </Button>
      </div>
      <ThemeToggle />
    </div>
  );
}