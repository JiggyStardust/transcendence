// GENERATED FOR TESTING PURPOSE

import { useEffect } from 'react';

export default function BabylonTest() {
  useEffect(() => {
    console.log("useEffect");
    //const scriptBaby = document.createElement('script');
    // scriptBaby.src = 'babylon.max.js';
    // document.body.appendChild(scriptBaby);
    const script = document.createElement('script');
    script.src = 'game.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      // document.body.removeChild(scriptBaby);
    };
  }, []);

  return (
    <div id="game" className="relative flex h-screen justify-center items-center z-10">
      <canvas width="1280" height="720" id="renderCanvas" ></canvas>
    </div>
  );
}
