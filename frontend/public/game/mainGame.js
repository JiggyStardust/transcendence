import {game} from "./game.js";
console.log(game);
import {parseUsername} from "./parseUsername.js";
console.log(parseUsername);
import {createScene} from "./createScene.js";
import {applyCollision} from "./applyCollision.js";
import {moveSphere} from "./moveSphere.js";
import {moveCamera} from "./moveCamera.js";
import {updateScoreText} from "./updateScoreText.js";
import {pointScored} from "./pointScored.js";
import {reset} from "./reset.js";
import {gameOver} from "./gameOver.js";

// Init
console.log("log 1");

game.canvas = document.getElementById('renderCanvas');
game.engine = new BABYLON.Engine(game.canvas, true);


await parseUsername(game);
await createScene(game);

// Render loop
game.engine.runRenderLoop(function () {
  //game.currentState = game.state.start; //REMOVE
  //game.currentState = game.state.gameOver;
  switch(game.currentState) {
    case game.state.start:
      reset(game);
      break;
    case game.state.playing:
      applyCollision(game);
      moveSphere(game);
      moveCamera(game);
      break;
    case game.state.pointScored:
      pointScored(game);
      break;
    case game.state.reset:
      reset(game);
      break;
    case game.state.gameOver:
      gameOver(game);
      break;
    }
  updateScoreText(game);
  game.scene.render();
});

// Window Resize
window.addEventListener("resize", () => {
  game.engine.resize();
});
