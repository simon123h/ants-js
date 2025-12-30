// Scent emitted by ants (optimized: flat typed arrays)
export default class Scent {
  constructor(res, color, max) {
    this.resolution = res; // resolution of the grid in px
    this.color = color; // color for visualization
    this.max = max; // max value for visualization

    // compute grid size and allocate flat buffers
    this.gridW = Math.ceil(window.innerWidth / this.resolution) + 1;
    this.gridH = Math.ceil(window.innerHeight / this.resolution) + 1;
    const size = this.gridW * this.gridH;
    this.data = new Float32Array(size);
    this.temp = new Float32Array(size);
  }

  // helper: convert pixel coords -> grid index, returns -1 if out of bounds
  idxFromXY(x, y) {
    const gx = Math.floor(x / this.resolution);
    const gy = Math.floor(y / this.resolution);
    if (gx < 0 || gy < 0 || gx >= this.gridW || gy >= this.gridH) return -1;
    return gx + gy * this.gridW;
  }

  // obtain value of scent at a position (x, y)
  get(x, y) {
    const idx = this.idxFromXY(x, y);
    if (idx < 0) return 0;
    return this.data[idx];
  }

  // increase the value of the scent at a position (x, y)
  push(x, y, value) {
    const gx = Math.floor(x / this.resolution);
    const gy = Math.floor(y / this.resolution);
    if (gx < 0 || gy < 0 || gx >= this.gridW || gy >= this.gridH) return;
    const i = gx + gy * this.gridW;
    this.data[i] += value;
    // also add to surrounding cells (8-neighbors)
    const add = value / 3;
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        if (ox === 0 && oy === 0) continue;
        const nx = gx + ox;
        const ny = gy + oy;
        if (nx >= 0 && ny >= 0 && nx < this.gridW && ny < this.gridH) {
          this.data[nx + ny * this.gridW] += add;
        }
      }
    }
  }

  // every step of game loop: diffuse and decay scent intensity
  step() {
    const w = this.gridW;
    const h = this.gridH;
    const data = this.data;
    const temp = this.temp;
    const size = data.length;

    // zero temp
    temp.fill(0);

    // diffuse to temp using 4-neighbor kernel approximation
    for (let y = 1; y < h - 1; y++) {
      let rowIndex = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = rowIndex + x;
        temp[idx] += 0.002 * data[idx - 1]; // left
        temp[idx] += 0.002 * data[idx + 1]; // right
        temp[idx] += 0.002 * data[idx - w]; // up
        temp[idx] += 0.002 * data[idx + w]; // down
      }
    }

    // apply diffusion
    for (let i = 0; i < size; i++) data[i] += temp[i];

    // decay
    for (let i = 0; i < size; i++) {
      data[i] *= 0.987;
      if (data[i] < 0.01) data[i] = 0;
    }
  }

  // visualize the scent
  draw(context) {
    context.fillStyle = this.color;
    const w = this.gridW;
    const res = this.resolution;
    for (let idx = 0; idx < this.data.length; idx++) {
      let val = this.data[idx] / this.max;
      if (val <= 0) continue;
      if (val > 1) val = 1;
      const gx = idx % w;
      const gy = Math.floor(idx / w);
      context.globalAlpha = val * 0.5;
      context.fillRect(gx * res, gy * res, res, res);
    }
    context.globalAlpha = 1;
  }
}
