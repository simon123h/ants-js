class Slowzone extends Obj {
  constructor(x, y, width, height, factor = 3) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/slowzone.png";
    this.image.width = width || 150;
    this.image.height = height || 150;
    this.factor = factor
  }

  detect(ant) {
    if (ant.speed == ant.default_speed) {
      setTimeout(function () {
        ant.speed = ant.default_speed;
      }, 400);
      ant.speed = ant.default_speed / this.factor;
    }
  };
};
