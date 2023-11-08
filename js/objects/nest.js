
class Nest extends Obj {
	constructor(x, y) {
		super();

		this.x = x || window.innerWidth * Math.random();	//x-Position [int]
		this.y = y || window.innerHeight * Math.random();	//y-Position [int]
		this.image.src = "res/nest.png";
		this.image.width = 120;
		this.image.height = 120;
		this.aromaStrength = 10;
		game.objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);
	}

	detect(by) {
		if (!by.colliding) {
			if (by.cargo == "sugar") by.deploySugar();
			by.excite();
			by.colliding = true;
			setTimeout(function () { by.colliding = false; }, 1000 * game.time_scale);
		}
	}

	active() {
		var curNest = this;
		this.activeInterval = setInterval(function () {
			game.aromas.ant.push(curNest.x + (Math.random() - 0.5) * 100, curNest.y + (Math.random() - 0.5) * 100, curNest.aromaStrength);
		}, 100 * game.time_scale);
	}

	// TODO: reactivate
	// this.active();

	stop() {
		clearInterval(this.activeInterval);
	}

	remove() {
		this.stop();
		var index = objs.indexOf(this);
		objs.splice(index, 1);
		game.objMap.rebuild();
	}
}


