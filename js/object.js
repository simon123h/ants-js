// Class for all objects
export default class Obj {
  constructor(x, y) {
    this.x = x || window.innerWidth * Math.random(); // x position
    this.y = y || window.innerHeight * Math.random(); // y position
    this.direction = 0; // orientation (rad)
    this.image = new Image();
  }

  // called at every step during the game loop
  step() {}

  // called if the object is detected by an ant
  detect(ant) {}
  // called if the object is probed by an ant
  leftProbeDetect(ant) {}
  rightProbeDetect(ant) {}

  // draw the object onto the map
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.direction);
    context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
    context.restore();
  }
}
