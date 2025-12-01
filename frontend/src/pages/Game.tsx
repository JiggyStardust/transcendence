import { ThemeToggle } from "../components/ThemeToggle";
import { useEffect } from "react";

export default function Game() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/game/mainGame.js';
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      if (script.parentNode === document.body) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
      <canvas width="1280" height="720" id="renderCanvas"></canvas>
      <ThemeToggle />
    </div>
  );
}
