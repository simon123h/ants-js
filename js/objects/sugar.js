
class Sugar extends Obj {
  constructor(x, y) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/sugar.png";
    this.image.width = 35;
    this.image.height = 35;
    this.amount = 250;
    this.scentStrength = 10;
  }

  detect(ant) {
    if (ant.idle) ant.take_sugar(this);
  };

  step() {
    // TODO: do not make this random-based
    // TODO: is this even needed?
    if (Math.random() < 0.1818)
      game.scents.ant.push(this.x, this.y, this.scentStrength);
  };
};
