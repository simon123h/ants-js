// Scent emitted by ants
export default class Scent {
  constructor(res, color, max) {
    this.resolution = res; // resolution of the grid in px
    this.color = color; // color for visualization
    this.max = max; // max value for visualization
    this.memory = new Array();
    this.memory2 = new Array();
    // initialize memory array
    const xMax = window.innerWidth / this.resolution;
    const yMax = window.innerHeight / this.resolution;
    for (let i = 0; i <= xMax; i++) {
      this.memory[i] = new Array();
      this.memory2[i] = new Array();
      for (let j = 0; j <= yMax; j++) {
        this.memory[i][j] = 0;
        this.memory2[i][j] = 0;
      }
    }
  }

  // obtain value of scent at a position (x, y)
  get(x, y) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (typeof this.memory[x] == "undefined" || typeof this.memory[x][y] == "undefined") {
      return 0;
    }
    return this.memory[x][y];
  }

  // increase the value of the scent at a position (x, y)
  push(x, y, value) {
    x = Math.floor(x / this.resolution);
    y = Math.floor(y / this.resolution);
    if (typeof this.memory[x][y] == "undefined") return;
    this.memory[x][y] += value;
    // also put some scent to the surroundings
    if (typeof this.memory[x + 1] != "undefined" && typeof this.memory[x + 1][y + 1] != "undefined") this.memory[x + 1][y + 1] += value / 3;
    if (typeof this.memory[x + 1] != "undefined" && typeof this.memory[x + 1][y] != "undefined") this.memory[x + 1][y] += value / 3;
    if (typeof this.memory[x + 1] != "undefined" && typeof this.memory[x + 1][y - 1] != "undefined") this.memory[x + 1][y - 1] += value / 3;
    if (typeof this.memory[x] != "undefined" && typeof this.memory[x][y + 1] != "undefined") this.memory[x][y + 1] += value / 3;
    if (typeof this.memory[x] != "undefined" && typeof this.memory[x][y - 1] != "undefined") this.memory[x][y - 1] += value / 3;
    if (typeof this.memory[x - 1] != "undefined" && typeof this.memory[x - 1][y + 1] != "undefined") this.memory[x - 1][y + 1] += value / 3;
    if (typeof this.memory[x - 1] != "undefined" && typeof this.memory[x - 1][y] != "undefined") this.memory[x - 1][y] += value / 3;
    if (typeof this.memory[x - 1] != "undefined" && typeof this.memory[x - 1][y - 1] != "undefined") this.memory[x - 1][y - 1] += value / 3;
  }

  // every step of game loop: decay scent intensity
  step() {
    // diffuse
    for (let i = 0; i < this.memory.length; i++) for (let j = 0; j < this.memory[i].length; j++) this.memory2[i][j] = 0;
    for (let i = 1; i < this.memory2.length - 1; i++)
      for (let j = 1; j < this.memory2[i].length - 1; j++) {
        this.memory2[i][j] += 0.002 * this.memory[i - 1][j];
        this.memory2[i][j] += 0.002 * this.memory[i + 1][j];
        this.memory2[i][j] += 0.002 * this.memory[i][j - 1];
        this.memory2[i][j] += 0.002 * this.memory[i][j + 1];
      }
    for (let i = 0; i < this.memory.length; i++) for (let j = 0; j < this.memory[i].length; j++) this.memory[i][j] += this.memory2[i][j];
    // decay
    for (let i = 0; i < this.memory.length; i++) {
      for (let j = 0; j < this.memory[i].length; j++) {
        this.memory[i][j] *= 0.987;
        if (this.memory[i][j] < 0.01) this.memory[i][j] = 0;
      }
    }
  }

  // visualize the scent
  draw(context) {
    for (let i = 0; i < this.memory.length; i++) {
      for (let j = 0; j < this.memory[i].length; j++) {
        let val = this.memory[i][j] / this.max;
        if (val > 1) val = 1;
        context.fillStyle = this.color;
        context.globalAlpha = val * 0.5;
        context.fillRect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
        context.globalAlpha = 1;
      }
    }
  }
}
