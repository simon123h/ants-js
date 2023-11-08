
// global variable for the current game
var game = null;
// generate a new game
// TODO: move this into the onload function
game = new AntGame();

window.onload = function () {
  // visualization loop
  start_visualization();
  // generate objects in the game
  setTimeout(function () {
    for (var i = 0; i < 1; i++) new Nest(280, 280);
    for (var i = 0; i < 2; i++) new Obstacle();
    for (var i = 0; i < 1; i++) new Slowzone();
    for (var i = 0; i < 0; i++) new Portal();
    for (var i = 0; i < 3; i++) new Sugar();
    for (var i = 0; i < 80; i++) new Ant(250, 250, undefined, 24);

    // Aroma Overlay
    sugarAroma.monitor(0, 0, 255, 37);
    antAroma.monitor(255, 0, 0, 80);
    nestAroma.monitor(220, 220, 0, 30);

    // Grenzen
    /*
    new Obstacle(-25, window.innerHeight/2-25, 50, window.innerHeight+50);
    new Obstacle(window.innerWidth+25, window.innerHeight/2-25, 50, window.innerHeight+50);
    new Obstacle(window.innerWidth/2-25, -25, window.innerWidth+50, 50);
    new Obstacle(window.innerWidth/2-25, window.innerHeight+25, window.innerWidth+60, 50);
    */
  });
};

// add new scent by clicking
document.onclick = function (e) {
  var x = e.pageX;
  var y = e.pageY;
  antAroma.push(x, y, 100);
};

// start the visualization loop
function start_visualization() {
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
  for (var i = 0; i < objs.length; i++) {
    curObj = objs[i];
    var x = curObj.getX();
    var y = curObj.getY();
    drawRotated(context, curObj.image, x, y, curObj.direction);
  }
}

// draw the scent overlay
function overlay() {
  canvas = document.getElementById("overlay");
  context = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (n in monitorAromas) {
    var mem = monitorAromas[n].obj.memory;
    for (var i = 0; i < mem.length; i++) {
      for (var j = 0; j < mem[i].length; j++) {
        var val = mem[i][j] / monitorAromas[n].max;
        if (val > 1) val = 1;
        context.fillStyle =
          "rgba(" +
          monitorAromas[n].r +
          ", " +
          monitorAromas[n].g +
          ", " +
          monitorAromas[n].b +
          ", " +
          val +
          ")";
        context.fillRect(
          i * antAroma.resolution,
          j * antAroma.resolution,
          antAroma.resolution,
          antAroma.resolution,
        );
      }
    }
  }

  /*
  var mem = objMap.memory;
  for(var i=0; i<mem.length; i++){
    if(typeof(mem[i])!="undefined")
    for(var j=0; j<mem[i].length; j++){
      if(typeof(mem[i][j])!="undefined") context.fillStyle = "#F00";
      else context.fillStyle = "#FFF";
      context.fillRect(i*objMap.resolution, j*objMap.resolution, objMap.resolution, objMap.resolution);
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
function newAnts(n) { for (var i = 0; i < n; i++) new Ant(); }
function undoObj() { objs[objs.length - 1].die(); }
