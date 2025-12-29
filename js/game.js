import Scent from "./scent.js";
import ObjectMap from "./objectmap.js";

export class AntGame {
  constructor() {
    // array of objects in the game (including ants)
    this.objects = [];
    // array of scents in the game
    this.scents = {
      ant: new Scent(15, "rgb(255, 0, 0)", 80),
      nest: new Scent(15, "rgb(220, 220, 0)", 30),
      sugar: new Scent(15, "rgb(0, 0, 255)", 37),
    };

    // the interval for the game loop
    this.game_intvl = null;
    // game object map, TODO: can I find some better algorithm for this?
    this.objMap = new ObjectMap(15);
    this.settings = {
      scent_view: true,
      substeps: 1,
    };
    this.stats = {
      score: 0,
      rel_score: 0,
    };
  }

  // do a step for every object in the game
  step() {
    if (this.settings.substeps < 0) this.settings.substeps = 0;
    for (var i = 0; i < this.settings.substeps; i++) {
      for (var obj of this.objects) obj.step();
      for (var a in this.scents) this.scents[a].step();
    }
  }

  // add an object to the game
  add_object(obj, prevent_collisions = false) {
    var n = 0;
    // do not place objects onto each other if prevent_collisions == true
    while (prevent_collisions && n < 100 && this.objMap.get(obj.x, obj.y).length > 0) {
      n++;
      obj.x = window.innerWidth * Math.random();
      obj.y = window.innerHeight * Math.random();
    }
    this.objects.push(obj);
    this.objMap.rebuild(this.objects);
  }

  // remove an object from the game
  remove_object(obj) {
    this.objects.splice(this.objects.indexOf(obj), 1);
    this.objMap.rebuild(this.objects);
  }

  // get an ant nest from the objects
  get_nest() {
    for (var obj of this.objects) if (obj.constructor.name === "Nest") return obj;
  }

  get ants() {
    return this.objects.filter((o) => o.constructor.name === "Ant");
  }

  show_stats() {
    var statsbox = document.getElementById("stats");
    var time = (performance.now() - this.stats.start_time) / 1000;
    var rate = (this.stats.rel_score / time).toFixed(1);
    var score = this.stats.score.toFixed(0);
    statsbox.innerHTML = `Total sugar: ${score}<br>Sugar/sec: ${rate}`;
  }
}

export const game = new AntGame();
