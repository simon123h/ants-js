// global variable for the current game
var game = null;

window.onload = function () {
  // generate a new game
  game = new AntGame();
  start_game();
  // generate objects in the game
  for (var i = 0; i < 2; i++) game.add_object(new Obstacle());
  for (var i = 0; i < 1; i++) game.add_object(new Slowzone());
  for (var i = 0; i < 0; i++) game.add_object(new Portal());
  for (var i = 0; i < 3; i++) game.add_object(new Sugar(), true);
  var nest = new Nest();
  game.add_object(nest, true);
  for (var i = 0; i < 80; i++) game.add_object(new Ant(nest.x, nest.y, 24));

  // boundaries of the map
  // game.add_object(new Obstacle(-25, window.innerHeight/2-25, 50, window.innerHeight+50));
  // game.add_object(new Obstacle(window.innerWidth+25, window.innerHeight/2-25, 50, window.innerHeight+50));
  // game.add_object(new Obstacle(window.innerWidth/2-25, -25, window.innerWidth+50, 50));
  // game.add_object(new Obstacle(window.innerWidth/2-25, window.innerHeight+25, window.innerWidth+60, 50));

  // add new scent by clicking
  document.getElementById("frame").onclick = function (e) {
    var x = e.pageX;
    var y = e.pageY;
    game.scents.ant.push(x, y, 100);
  };
};

// start the game and visualization loops
function start_game() {
  setInterval(function () {
    game.step();
  }, 20);
  setInterval(redraw, 30);
  setInterval(overlay, 100);
  game.stats.start_time = performance.now() / 1000;
}

// draw all objects in the game
function redraw() {
  var canvas = document.getElementById("frame");
  var context = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var obj of game.objects)
    obj.draw(context);
  game.show_stats();
}

// draw the scent overlay
function overlay() {
  canvas = document.getElementById("overlay");
  context = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!game.settings.scent_view) return;
  for (var a in game.scents) game.scents[a].draw(context);

  // draw the ObjectMap (for debugging)
  // game.objMap.draw(context);
}
