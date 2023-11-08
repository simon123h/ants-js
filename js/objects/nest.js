
class Nest extends Obj {
	constructor(x, y) {
		super();
		this.x = x || window.innerWidth * Math.random();
		this.y = y || window.innerHeight * Math.random();
		this.image.src = "res/nest.png";
		this.image.width = 120;
		this.image.height = 120;
		this.scentStrength = 10;
		game.objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);
	}

	detect(ant) {
		if (!ant.colliding) {
			if (ant.cargo == "sugar") ant.deploy_sugar();
			ant.excite();
			ant.colliding = true;
			setTimeout(function () { ant.colliding = false; }, 200);
		}
	}

	step() {
		if (Math.random() < 0.2)
			game.scents.ant.push(this.x + (Math.random() - 0.5) * 100, this.y + (Math.random() - 0.5) * 100, this.scentStrength);
	}

}


