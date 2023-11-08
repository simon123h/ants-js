class Slowzone extends Obj {
  constructor(x, y, width, height) {
    super();
    this.x = x || window.innerWidth * Math.random();
    this.y = y || window.innerHeight * Math.random();
    this.image.src = "res/slowzone.png";
    this.image.width = width || 150;
    this.image.height = height || 150;
    game.objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);
  }

  detect(by) {
    if (by.speed == 3) {
      setTimeout(function () {
        by.speed = 3;
      }, 2000 * game.time_scale);
      by.speed = 1;
    }
  };
};
