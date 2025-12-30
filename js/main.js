import { game } from "./game.js";
import Obstacle from "./objects/obstacle.js";
import Slowzone from "./objects/slowzone.js";
import Sugar from "./objects/sugar.js";
import Nest from "./objects/nest.js";
import Ant from "./ant.js";

// global variable for the current game
// var game = null;
window.game = game;

window.onload = function () {
  // generate a new game
  // game = new AntGame();
  start_game();
  // generate objects in the game
  for (let i = 0; i < 2; i++) game.add_object(new Obstacle());
  for (let i = 0; i < 1; i++) game.add_object(new Slowzone());
  // for (let i = 0; i < 0; i++) game.add_object(new Portal());
  for (let i = 0; i < 3; i++) game.add_object(new Sugar(), true);
  const nest = new Nest();
  game.add_object(nest, true);
  for (let i = 0; i < 80; i++) game.add_object(new Ant(nest.x, nest.y, 24));

  // boundaries of the map
  // game.add_object(new Obstacle(-25, window.innerHeight/2-25, 50, window.innerHeight+50));
  // game.add_object(new Obstacle(window.innerWidth+25, window.innerHeight/2-25, 50, window.innerHeight+50));
  // game.add_object(new Obstacle(window.innerWidth/2-25, -25, window.innerWidth+50, 50));
  // game.add_object(new Obstacle(window.innerWidth/2-25, window.innerHeight+25, window.innerWidth+60, 50));

  // add new scent by clicking
  document.getElementById("frame").onclick = function (e) {
    const x = e.pageX;
    const y = e.pageY;
    game.scents.ant.push(x, y, 100);
  };
};

// start the game and visualization loops
function start_game() {
  setInterval(function () {
    game.step();
  }, 20);

  // resize canvases on window resize only
  const resizeCanvases = () => {
    const canvas = document.getElementById("frame");
    const overlayCanvas = document.getElementById("overlay");
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    if (overlayCanvas) {
      overlayCanvas.width = window.innerWidth;
      overlayCanvas.height = window.innerHeight;
    }
  };
  window.addEventListener('resize', resizeCanvases);
  // set initial sizes once
  resizeCanvases();

  // Use requestAnimationFrame for drawing at the browser's repaint frequency.
  let drawRAF;
  const drawLoop = () => {
    redraw();
    overlay();
    drawRAF = requestAnimationFrame(drawLoop);
  };
  drawRAF = requestAnimationFrame(drawLoop);

  game.stats.start_time = performance.now() / 1000;
}

// draw all objects in the game
function redraw() {
  const canvas = document.getElementById("frame");
  const context = canvas.getContext("2d");
  // canvas dimensions are managed on resize; just clear using current size
  context.clearRect(0, 0, canvas.width || window.innerWidth, canvas.height || window.innerHeight);
  for (const obj of game.objects) obj.draw(context);
  game.show_stats();
}

// draw the scent overlay
function overlay() {
  const canvas = document.getElementById("overlay");
  const context = canvas.getContext("2d");
  // canvas dimensions are managed on resize; just clear using current size
  context.clearRect(0, 0, canvas.width || window.innerWidth, canvas.height || window.innerHeight);
  if (!game.settings.scent_view) return;
  for (const a in game.scents) game.scents[a].draw(context);

  // draw the ObjectMap (for debugging)
  // game.objMap.draw(context);
}
