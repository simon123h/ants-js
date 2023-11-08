// TODO: remove this global variable
objCounter = 0;

// Class for all objects
class Obj {
  constructor(x, y) {
    this.x = x || window.innerWidth * Math.random(); //x-Position
    this.y = y || window.innerHeight * Math.random(); //y-Position
    this.direction = 0; // current direction of movement (rad)
    this.image = new Image();
    this.id = objCounter++;
    this.stackable = true;
  }

  // called at every step during the game loop
  step() { }

  // called if the object is detected by an ant
  detect(by) { }
  // called if the object is probed by an ant
  leftProbeDetect(by) { }
  rightProbeDetect(by) { }

  //Entfernt werden
  remove() {
    var index = game.objects.indexOf(this);
    game.objects.splice(index, 1);
    game.objMap.rebuild();
  }
}
