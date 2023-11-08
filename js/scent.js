// Scent emitted by ants
class Scent {
  constructor(res, color, max) {
    this.resolution = res; // resolution of the grid in px
    this.color = color; // color for visualization
    this.max = max; // max value for visualization
    this.memory = new Array();
    // initialize memory array
    var xMax = window.innerWidth / this.resolution;
    var yMax = window.innerHeight / this.resolution;
    for (var i = 0; i < xMax; i++) {
      this.memory[i] = new Array();
      for (var j = 0; j < yMax; j++) {
        this.memory[i][j] = 0;
      }
    }
  }

  // obtain value of scent at a position (x, y)
  get(x, y) {
    var x = Math.floor(x / this.resolution);
    var y = Math.floor(y / this.resolution);
    if (
      typeof this.memory[x] == "undefined" ||
      typeof this.memory[x][y] == "undefined"
    ) {
      return 0;
    }
    return this.memory[x][y];
  };

  // increase the value of the scent at a position (x, y)
  push(x, y, value) {
    var x = Math.floor(x / this.resolution);
    var y = Math.floor(y / this.resolution);
    if (typeof this.memory[x][y] == "undefined")
      return;
    this.memory[x][y] += value;
    // also put some scent to the surroundings
    if (
      typeof this.memory[x + 1] != "undefined" &&
      typeof this.memory[x + 1][y + 1] != "undefined"
    )
      this.memory[x + 1][y + 1] += value / 3;
    if (
      typeof this.memory[x + 1] != "undefined" &&
      typeof this.memory[x + 1][y] != "undefined"
    )
      this.memory[x + 1][y] += value / 3;
    if (
      typeof this.memory[x + 1] != "undefined" &&
      typeof this.memory[x + 1][y - 1] != "undefined"
    )
      this.memory[x + 1][y - 1] += value / 3;
    if (
      typeof this.memory[x] != "undefined" &&
      typeof this.memory[x][y + 1] != "undefined"
    )
      this.memory[x][y + 1] += value / 3;
    if (
      typeof this.memory[x] != "undefined" &&
      typeof this.memory[x][y - 1] != "undefined"
    )
      this.memory[x][y - 1] += value / 3;
    if (
      typeof this.memory[x - 1] != "undefined" &&
      typeof this.memory[x - 1][y + 1] != "undefined"
    )
      this.memory[x - 1][y + 1] += value / 3;
    if (
      typeof this.memory[x - 1] != "undefined" &&
      typeof this.memory[x - 1][y] != "undefined"
    )
      this.memory[x - 1][y] += value / 3;
    if (
      typeof this.memory[x - 1] != "undefined" &&
      typeof this.memory[x - 1][y - 1] != "undefined"
    )
      this.memory[x - 1][y - 1] += value / 3;
  };

  // every step of game loop: decay scent intensity
  step() {
    for (var i = 0; i < this.memory.length; i++) {
      for (var j = 0; j < this.memory[i].length; j++) {
        this.memory[i][j] *= 0.996;
        if (this.memory[i][j] < 0.01) this.memory[i][j] = 0;
      }
    }
  };

  // visualize the scent
  draw(context) {
    for (var i = 0; i < this.memory.length; i++) {
      for (var j = 0; j < this.memory[i].length; j++) {
        var val = this.memory[i][j] / this.max;
        if (val > 1) val = 1;
        context.fillStyle = this.color;
        context.globalAlpha = val * 0.5;
        context.fillRect(
          i * this.resolution,
          j * this.resolution,
          this.resolution,
          this.resolution,
        );
        context.globalAlpha = 1;
      }
    }
  }

};
