// Shared image resources loader
const images = {
  default: new Image(),
  ant: new Image(),
  antWithSugar: new Image(),
  sugar: new Image(),
  nest: new Image(),
  obstacle: new Image(),
  slowzone: new Image(),
};

// tiny transparent pixel as default
images.default.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
images.ant.src = 'res/ant.png';
images.antWithSugar.src = 'res/antWithSugar.png';
images.sugar.src = 'res/sugar.png';
images.nest.src = 'res/nest.png';
images.obstacle.src = 'res/obstacle.png';
images.slowzone.src = 'res/slowzone.png';

export default {
  get(name) {
    return images[name] || images.default;
  },
};
