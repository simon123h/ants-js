// global variable for the current game
var game = null;

window.onload = function () {
  // generate a new game
  game = new AntGame();
  start_game();
  // generate objects in the game
  for (var i = 0; i < 1; i++) game.add_object(new Nest(280, 280));
  for (var i = 0; i < 2; i++) game.add_object(new Obstacle());
  for (var i = 0; i < 1; i++) game.add_object(new Slowzone());
  for (var i = 0; i < 0; i++) game.add_object(new Portal());
  for (var i = 0; i < 3; i++) game.add_object(new Sugar());
  for (var i = 0; i < 80; i++) game.add_ant(new Ant(250, 250, undefined, 24));

  // Grenzen
  /*
  new Obstacle(-25, window.innerHeight/2-25, 50, window.innerHeight+50);
  new Obstacle(window.innerWidth+25, window.innerHeight/2-25, 50, window.innerHeight+50);
  new Obstacle(window.innerWidth/2-25, -25, window.innerWidth+50, 50);
  new Obstacle(window.innerWidth/2-25, window.innerHeight+25, window.innerWidth+60, 50);
  */
};

// add new scent by clicking
document.onclick = function (e) {
  var x = e.pageX;
  var y = e.pageY;
  game.aromas.ant.push(x, y, 100);
};

// start the game and visualization loops
function start_game() {
  game_intvl = setInterval(function () { game.step(); }, 20);
  canvasIntvl = setInterval(redraw, 20);
  overlayIntvl = setInterval(overlay, 90);
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
  for (var ant of game.ants)
    drawRotated(context, ant.image, ant.x, ant.y, ant.direction);
}

// draw the scent overlay
function overlay() {
  canvas = document.getElementById("overlay");
  context = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var a in game.aromas) {
    var aroma = game.aromas[a];
    // TODO: make this a method of the aromas
    var mem = aroma.memory;
    for (var i = 0; i < mem.length; i++) {
      for (var j = 0; j < mem[i].length; j++) {
        var val = mem[i][j] / aroma.max;
        if (val > 1) val = 1;
        context.fillStyle = aroma.color;
        context.globalAlpha = val;
        context.fillRect(
          i * aroma.resolution,
          j * aroma.resolution,
          aroma.resolution,
          aroma.resolution,
        );
        context.globalAlpha = 1;
      }
    }
  }

  /*
  var mem = game.objMap.memory;
  for(var i=0; i<mem.length; i++){
    if(typeof(mem[i])!="undefined")
    for(var j=0; j<mem[i].length; j++){
      if(typeof(mem[i][j])!="undefined") context.fillStyle = "#F00";
      else context.fillStyle = "#FFF";
      context.fillRect(i*game.objMap.resolution, j*game.objMap.resolution, game.objMap.resolution, game.objMap.resolution);
    }
  }
  */
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

// auxiliary functions for debugging
function newAnts(n) {
  for (var i = 0; i < n; i++) new Ant();
}
