
class Sugar extends Obj {
  constructor(x, y) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/sugar.png";
    this.image.width = 35;
    this.image.height = 35;
    this.amount = 250;
    this.aromaStrength = 10;
    game.objMap.pushArea(this.x, this.y, 45, 45, this);
  }

  detect(by) {
    if (by.idle) {
      by.takeSugar(this);
    }
  };

  step() {
    // TODO: do not make this random-based
    if (Math.random() < 0.1818)
      game.aromas.ant.push(this.x, this.y, this.aromaStrength);
  };
};
