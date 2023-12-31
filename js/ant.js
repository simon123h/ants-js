
// Class for ants
class Ant extends Obj {
	constructor(x, y, probeLength) {
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
		this.image.src = "res/ant.png";
		this.image.width = 15;
		this.image.height = 15;
		this.collision_timeout = 0;
		this.scentStrength = 0;
		this.stats = { score: 0, days_wo_nest: 0 }
	}

	// make a step forward
	step() {
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
		if (Math.random() < 0.4)
			this.nose();
		this.detectObjects();
		// decrease collision timeout counter
		if (this.collision_timeout > 0) this.collision_timeout--;
		// drop sugar if the ant has not seen the nest for too long
		if (!this.idle)
			this.stats.days_wo_nest++;
		else
			this.stats.days_wo_nest = 0;
		if (this.stats.days_wo_nest > 10000) {
			this.idle = true;
			this.cargo = null;
			this.image.src = "res/ant.png";
			this.stats.days_wo_nest = 0;
			console.log("dropped sugar")
		}
	}

	// pick up scents and make movement decisions based on the scents around it
	nose() {
		var range = this.probeLength;
		// unit vector parallel to the movement direction
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) };
		// unit vector normal to the movement direction
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) };
		var leftProbe = {
			x: this.x + range * (2 * e_p.x + e_n.x),
			y: this.y + range * (2 * e_p.y + e_n.y),
		};
		var rightProbe = {
			x: this.x + range * (2 * e_p.x - e_n.x),
			y: this.y + range * (2 * e_p.y - e_n.y),
		};
		var leftVal = 0;
		var rightVal = 0;
		leftVal = game.scents.ant.get(leftProbe.x, leftProbe.y);
		rightVal = game.scents.ant.get(rightProbe.x, rightProbe.y);
		var aim = (this.cargo == "sugar") ? "nest" : "sugar";
		leftVal += game.scents[aim].get(leftProbe.x, leftProbe.y);
		rightVal += game.scents[aim].get(rightProbe.x, rightProbe.y);
		if (leftVal > rightVal) this.direction -= Math.random() * 0.5;
		else if (leftVal < rightVal) this.direction += Math.random() * 0.5;
	}

	// emit ant scent
	emitAntScent() {
		game.scents.ant.push(this.x, this.y, this.scentStrength);
		if (this.cargo == "sugar") game.scents.sugar.push(this.x, this.y, 3);
		if (this.idle == true) game.scents.nest.push(this.x, this.y, 1);
	}

	// search for objects in the current location and possibly interact
	detectObjects() {
		// objects at the current location
		for (var obj of game.objMap.get(this.x, this.y))
			obj.detect(this);
		// objects at the probes
		var range = this.probeLength * 0.3;
		// unit vector parallel to the movement direction
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) };
		// unit vector normal to the movement direction
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) };
		var leftProbe = {
			x: this.x + range * (2 * e_p.x + e_n.x),
			y: this.y + range * (2 * e_p.y + e_n.y),
		};
		var rightProbe = {
			x: this.x + range * (2 * e_p.x - e_n.x),
			y: this.y + range * (2 * e_p.y - e_n.y),
		};
		for (var obj of game.objMap.get(leftProbe.x, leftProbe.y))
			obj.leftProbeDetect(this);
		for (var obj of game.objMap.get(rightProbe.x, rightProbe.y))
			obj.rightProbeDetect(this);
	}

	// carry some sugar
	take_sugar(sugar) {
		this.image.src = "res/antWithSugar.png";
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
	deploy_sugar() {
		if (this.cargo != "sugar") return;
		this.image.src = "res/ant.png";
		this.idle = true;
		this.direction += Math.PI;
		this.cargo = null;
		this.stats.score++;
		game.stats.score++;
		game.stats.rel_score += 1. / game.settings.substeps;
	}

	// reset the ant and put it in the nest, equvalent to killing it and generating a new ant
	respawn() {
		console.log("respawn")
		var nest = game.get_nest();
		this.cargo = null;
		this.idle = true;
		this.image.src = "res/ant.png";
		this.x = nest.x;
		this.y = nest.y;
		this.stats.score = 0;
		this.stats.hunger = 0;
	}
}

AntCounter = 0;
