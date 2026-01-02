import GameObject from "./gameobject";
import { game } from "./game";
import { evolveAnts } from "./evolution";
import Sugar from "./objects/sugar";
import Resources from "./resources";

// Class for ants
export default class Ant extends GameObject {
  rad: number;
  default_speed: number;
  speed: number;
  cargo: string | null;
  idle: boolean;
  probeLength: number;
  collision_timeout: number;
  scentStrength: number;
  stats: {
    score: number;
    days_wo_nest: number;
    hunger?: number;
  };

  constructor(x?: number, y?: number, probeLength?: number) {
    super();
    this.x = x || window.innerWidth * Math.random(); // x position
    this.y = y || window.innerHeight * Math.random(); // y position
    this.rad = 10; // radius
    this.default_speed = 3; // motion speed
    this.default_speed *= 1 + 0.4 * (Math.random() - 0.5);
    this.speed = this.default_speed;
    this.direction = 2 * Math.PI * Math.random(); // motion direction
    this.cargo = null; // carried load
    this.idle = true; // is the ant idle?
    this.probeLength = probeLength || 24; // length of the probes
    this.image = Resources.get("ant");
    this.width = 15;
    this.height = 15;
    this.collision_timeout = 0;
    this.scentStrength = 0;
    this.stats = { score: 0, days_wo_nest: 0 };
  }

  // make a step forward
  step(): void {
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sin(this.direction);
    // make sure the ant does not leave the window boundaries
    if (this.x < this.rad / 2) {
      this.x = this.rad / 2;
      this.direction = 2 * Math.PI * Math.random();
    }
    if (this.y < this.rad / 2) {
      this.y = this.rad / 2;
      this.direction = 2 * Math.PI * Math.random();
    }
    if (this.x + this.rad / 2 > window.innerWidth) {
      this.x = window.innerWidth - this.rad / 2;
      this.direction = 2 * Math.PI * Math.random();
    }
    if (this.y + this.rad / 2 > window.innerHeight) {
      this.y = window.innerHeight - this.rad / 2;
      this.direction = 2 * Math.PI * Math.random();
    }
    // TODO: do not make this random-based for performance reasons
    if (Math.random() < 0.25) this.emitAntScent();
    if (Math.random() < 0.4) this.nose();
    this.detectObjects();
    // decrease collision timeout counter
    if (this.collision_timeout > 0) this.collision_timeout--;
    // drop sugar if the ant has not seen the nest for too long
    if (!this.idle) this.stats.days_wo_nest++;
    else this.stats.days_wo_nest = 0;
    if (this.stats.days_wo_nest > 10000) {
      this.idle = true;
      this.cargo = null;
      this.image.src = "res/ant.png";
      this.stats.days_wo_nest = 0;
      console.log("dropped sugar");
    }
  }

  // pick up scents and make movement decisions based on the scents around it
  nose(): void {
    const range = this.probeLength;
    // compute direction basis components (floats) to avoid temporary objects
    const cosD = Math.cos(this.direction);
    const sinD = Math.sin(this.direction);
    const epX = cosD;
    const epY = sinD;
    const enX = sinD;
    const enY = -cosD;
    const leftX = this.x + range * (2 * epX + enX);
    const leftY = this.y + range * (2 * epY + enY);
    const rightX = this.x + range * (2 * epX - enX);
    const rightY = this.y + range * (2 * epY - enY);
    let leftVal = game.scents.ant.get(leftX, leftY);
    let rightVal = game.scents.ant.get(rightX, rightY);
    const aim = this.cargo == "sugar" ? "nest" : "sugar";
    leftVal += game.scents[aim].get(leftX, leftY);
    rightVal += game.scents[aim].get(rightX, rightY);
    if (leftVal > rightVal) this.direction -= Math.random() * 0.5;
    else if (leftVal < rightVal) this.direction += Math.random() * 0.5;
  }

  // emit ant scent
  emitAntScent(): void {
    game.scents.ant.push(this.x, this.y, this.scentStrength);
    if (this.cargo == "sugar") game.scents.sugar.push(this.x, this.y, 3);
    if (this.idle == true) game.scents.nest.push(this.x, this.y, 1);
  }

  // search for objects in the current location and possibly interact
  detectObjects(): void {
    // objects at the current location
    for (const obj of game.objMap.get(this.x, this.y)) obj.detect(this);
    // objects at the probes
    const range = this.probeLength * 0.3;
    // compute probe coordinates with float locals to avoid garbage
    const cosD = Math.cos(this.direction);
    const sinD = Math.sin(this.direction);
    const epX = cosD;
    const epY = sinD;
    const enX = sinD;
    const enY = -cosD;
    const leftX = this.x + range * (2 * epX + enX);
    const leftY = this.y + range * (2 * epY + enY);
    const rightX = this.x + range * (2 * epX - enX);
    const rightY = this.y + range * (2 * epY - enY);
    for (const obj of game.objMap.get(leftX, leftY)) obj.leftProbeDetect(this);
    for (const obj of game.objMap.get(rightX, rightY)) obj.rightProbeDetect(this);
  }

  // carry some sugar
  take_sugar(sugar: Sugar): void {
    this.image = Resources.get("antWithSugar");
    this.direction += Math.PI;
    this.idle = false;
    this.cargo = "sugar";
    sugar.amount--;
    this.stats.hunger = 0;
    if (sugar.amount < 1) {
      game.remove_object(sugar);
      game.add_object(new Sugar(), true);
      evolveAnts(20);
    }
  }

  // deploy sugar at nest
  deploy_sugar(): void {
    if (this.cargo != "sugar") return;
    this.image = Resources.get("ant");
    this.idle = true;
    this.direction += Math.PI;
    this.cargo = null;
    this.stats.score++;
    game.stats.score++;
    game.stats.rel_score += 1 / game.settings.substeps;
  }

  // reset the ant and put it in the nest, equvalent to killing it and generating a new ant
  respawn(): void {
    console.log("respawn");
    const nest = game.get_nest();
    if (!nest) return; // Add check
    this.cargo = null;
    this.idle = true;
    this.image = Resources.get("ant");
    this.x = nest.x;
    this.y = nest.y;
    this.stats.score = 0;
    this.stats.hunger = 0;
  }
}
