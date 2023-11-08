// global variable for the current game
var game = null;

window.onload = function () {
  // generate a new game
  game = new AntGame();
  start_game();
  // generate objects in the game
  var nest = new Nest();
  game.add_object(nest);
  for (var i = 0; i < 2; i++) game.add_object(new Obstacle());
  for (var i = 0; i < 1; i++) game.add_object(new Slowzone());
  for (var i = 0; i < 0; i++) game.add_object(new Portal());
  for (var i = 0; i < 3; i++) game.add_object(new Sugar());
  for (var i = 0; i < 80; i++) game.add_object(new Ant(nest.x, nest.y, 24));

  // Grenzen
  // new Obstacle(-25, window.innerHeight/2-25, 50, window.innerHeight+50);
  // new Obstacle(window.innerWidth+25, window.innerHeight/2-25, 50, window.innerHeight+50);
  // new Obstacle(window.innerWidth/2-25, -25, window.innerWidth+50, 50);
  // new Obstacle(window.innerWidth/2-25, window.innerHeight+25, window.innerWidth+60, 50);
};

// start the game and visualization loops
function start_game() {
  setInterval(function () { game.step(); }, 20);
  setInterval(redraw, 20);
  setInterval(overlay, 100);
}

// draw all objects in the game
function redraw() {
  var canvas = document.getElementById("frame");
  var context = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var obj of game.objects)
    drawRotated(context, obj.image, obj.x, obj.y, obj.direction);
}

// draw the scent overlay
function overlay() {
  canvas = document.getElementById("overlay");
  context = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var a in game.aromas) {
    game.aromas[a].draw(context);
  }

  // draw the ObjectMap
  // var mem = game.objMap.memory;
  // for (var i = 0; i < mem.length; i++) {
  //   if (typeof (mem[i]) != "undefined")
  //     for (var j = 0; j < mem[i].length; j++) {
  //       if (typeof (mem[i][j]) != "undefined") context.fillStyle = "#F00";
  //       else context.fillStyle = "#FFF";
  //       context.fillRect(i * game.objMap.resolution, j * game.objMap.resolution, game.objMap.resolution, game.objMap.resolution);
  //     }
  // }
}

// auxiliary function to draw rotated images
function drawRotated(context, image, x, y, angle) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.drawImage(
    image,
    -image.width / 2,
    -image.height / 2,
    image.width,
    image.height,
  );
  context.restore();
}

// add new scent by clicking
document.onclick = function (e) {
  var x = e.pageX;
  var y = e.pageY;
  game.aromas.ant.push(x, y, 100);
};

