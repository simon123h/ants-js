
// Class for obstacles
class Obstacle extends Obj {
	constructor(x, y, width, height) {
		super();
		this.x = x || window.innerWidth * Math.random();
		this.y = y || window.innerHeight * Math.random();
		this.image.src = "res/obstacle.png";
		this.image.width = width || 90;
		this.image.height = height || 500;
		// TODO: what does this do?
		game.objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);
	}

	detect(by) {
		if (!by.colliding) {
			by.direction += Math.PI;
			by.colliding = true;
			setTimeout(function () { by.colliding = false; }, 1000 * game.time_scale);
		}
	}

	//Von Fuehler erfuelt werden
	leftProbeDetect(by) {
		if (!by.colliding) {
			by.direction += 1;
			by.colliding = true;
			setTimeout(function () { by.colliding = false; }, 100 * game.time_scale);
		}
	}
	rightProbeDetect(by) {
		if (!by.colliding) {
			by.direction -= 1;
			by.colliding = true;
			setTimeout(function () { by.colliding = false; }, 100 * game.time_scale);
		}
	}
}