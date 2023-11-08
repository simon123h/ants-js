
// Class for all objects
class Obj {
  constructor(x, y) {
    this.x = x || window.innerWidth * Math.random(); // x position
    this.y = y || window.innerHeight * Math.random(); // y position
    this.direction = 0; // orientation (rad)
    this.image = new Image();
  }

  // called at every step during the game loop
  step() { }

  // called if the object is detected by an ant
  detect(ant) { }
  // called if the object is probed by an ant
  leftProbeDetect(ant) { }
  rightProbeDetect(ant) { }
}
