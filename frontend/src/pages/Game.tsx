import { useEffect } from "react";

export default function Game() {
  useEffect(() => {
    // Set the player name globally
    window.p1Name = "wPlayer1";
    window.p2Name = "wPlayer2";
    window.p3Name = "wPlayer3";
    window.numberOfPlayers = 3;

    const script = document.createElement('script');
    script.src = '/game/mainGame.js';
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      if (script.parentNode === document.body) {
        document.body.removeChild(script);
      }
      // Clean up the global variable
      delete window.p1Name;
      delete window.p2Name;
      delete window.p3Name;
      delete window.numberOfPlayers;
    };
  }, []);

  return (
    <div className="page-bg flex flex-col items-center justify-center min-h-screen w-screen">
      <canvas width="1280" height="720" id="renderCanvas"></canvas>
    </div>
  );
}
