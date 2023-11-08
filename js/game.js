class AntGame {
  constructor() {
    this.time = 0;
    this.time_scale = 0.2;
    // array of ants in the game
    this.ants = [];
    // array of objects in the game
    this.objects = [];
    // array of aromas in the game
    this.aromas = {
      "sugar": new Aroma(15, "rgb(0, 0, 255)", 37),
      "ant": new Aroma(15, "rgb(255, 0, 0)", 80),
      "nest": new Aroma(15, "rgb(220, 220, 0)", 30),
    };

    // the interval for the game loop
    this.game_intvl = null;
    // game object map, TODO: can I find some better algorithm for this?
    this.objMap = new ObjectMap();
  }

  step() {
    for (var ant of this.ants) ant.step();
    for (var obj of this.objects) obj.step();
    for (var a in this.aromas) this.aromas[a].step()
  }

  // add an object to the game
  add_object(obj) {
    this.objects.push(obj);
  }
  add_ant(ant) {
    this.ants.push(ant);
  }

  // remove an object from the game
  remove_object(obj) {
    this.objects.splice(this.objects.indexOf(obj), 1);
    game.objMap.rebuild();
  }
}
