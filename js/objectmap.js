// discretized grid for efficient object collision detection
class ObjectMap {
  constructor(res) {
    this.resolution = res; // resolution of the grid in px
    this.memory = new Array();
  }

  // get array of objects at a position (x, y)
  get(x, y) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (
      typeof this.memory[x] == "undefined" ||
      typeof this.memory[x][y] == "undefined"
    ) {
      return new Array();
    }
    return this.memory[x][y];
  }

  // put an object onto the map
  push(x, y, obj) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (typeof this.memory[x] == "undefined") this.memory[x] = new Array();
    if (typeof this.memory[x][y] == "undefined")
      this.memory[x][y] = new Array();
    this.memory[x][y].push(obj);
  }

  // put an object that spans an area on the map
  pushArea(x, y, width, height, obj) {
    x -= width / 2 - 3;
    y -= height / 2 - 3;
    var xi = Math.floor(x / this.resolution);
    var xMax = Math.floor((x + width) / this.resolution);
    var yMax = Math.floor((y + height) / this.resolution);
    while (xi < xMax) {
      var yi = Math.floor(y / this.resolution);
      while (yi < yMax) {
        if (typeof this.memory[xi] == "undefined")
          this.memory[xi] = new Array();
        if (typeof this.memory[xi][yi] == "undefined")
          this.memory[xi][yi] = new Array();
        this.memory[xi][yi].push(obj);
        yi++;
      }
      xi++;
    }
  }

  // rebuild the map
  rebuild() {
    this.memory = new Array();
    for (var obj of game.objects) {
      if (obj.constructor == Ant) continue;
      this.pushArea(obj.x, obj.y, obj.image.width, obj.image.height, obj,);
    }
  }

  // draw the object map (for debugging purposes)
  draw(context) {
    for (var i = 0; i < this.memory.length; i++) {
      if (typeof (this.memory[i]) != "undefined")
        for (var j = 0; j < this.memory[i].length; j++) {
          if (typeof (this.memory[i][j]) != "undefined")
            context.fillStyle = "#F00";
          else
            context.fillStyle = "#FFF";
          context.fillRect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
        }
    }
  }

}
