class AntGame {
  constructor() {
    // array of objects in the game (including ants)
    this.objects = [];
    // array of scents in the game
    this.scents = {
      "sugar": new Scent(15, "rgb(0, 0, 255)", 37),
      "nest": new Scent(15, "rgb(220, 220, 0)", 30),
    };

    // the interval for the game loop
    this.game_intvl = null;
    // game object map, TODO: can I find some better algorithm for this?
    this.objMap = new ObjectMap(15);
    this.settings = {
      scent_view: true,
    }
  }

  // do a step for every object in the game
  step() {
    for (var obj of this.objects) obj.step();
    for (var a in this.scents) this.scents[a].step()
  }

  // add an object to the game
  add_object(obj) {
    this.objects.push(obj);
    game.objMap.rebuild();
  }

  // remove an object from the game
  remove_object(obj) {
    this.objects.splice(this.objects.indexOf(obj), 1);
    game.objMap.rebuild();
  }

  // get an ant nest from the objects
  get_nest() {
    for (var obj of game.objects)
      if (obj.constructor == Nest)
        return obj;
  }

  get ants() {
    return this.objects.filter((o) => (o.constructor == Ant));
  }
}
