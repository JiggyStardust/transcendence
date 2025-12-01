import { Button } from "../components/Button";
import pongImg from "../assets/pong-thumbnail.png";
import { IoMdPersonAdd } from "react-icons/io";

export default function Landing() {
  return (
    <div className="flex flex-col gap-15 items-center min-h-screen text-center transition-colors duration-500">
      {/* if want to make bg animated, add animated-bg to className above and enable it in  */}
      {/* className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 animated-bg" */}
      <h1 className="mt-4 font-press-start text-7xl text-red-700 dark:text-[#e3cc98] [word-spacing:-30px] tracking-[-0.1em]">Ping of Pongs</h1>
      <img src={ pongImg } alt="A photo of our game" className="rounded-xl shadow-lg w-1/2"/>
      <div className="space-x-4 flex align-center">
        <Button to="/signup" variant="primary">
          <IoMdPersonAdd className="text-red-700" /> Sign Up
        </Button>
      </div>
    </div>
  );
}