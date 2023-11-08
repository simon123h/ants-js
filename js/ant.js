
// Class for ants
class Ant extends Obj {
	constructor(x, y, probeLength) {
		super();
		this.x = x || window.innerWidth * Math.random(); // x position
		this.y = y || window.innerHeight * Math.random(); // y position
		this.rad = 10; // radius
		this.speed = 3; // motion speed
		this.direction = 2 * Math.PI * Math.random(); // motion direction
		this.cargo = null; // carried load
		this.idle = true; // is the ant idle?
		this.probeLength = probeLength || 24; // length of the probes
		this.image.src = "res/ant.png";
		this.image.width = 15;
		this.image.height = 15;
		this.colliding = false;
		this.idleScentStrength = 0.001;
		this.scentStrength = 0;
		this.score = 0;
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
		// occasionally change direction
		// if (Math.random() < 0.02) this.direction += 1.5 * (Math.random() - 0.5);
		// TODO: do not make this random-based for performance reasons
		if (Math.random() < 0.15) this.emitAntScent();
		if (Math.random() < 0.4) this.nose();
		if (Math.random() < 0.4) this.detectObjects();
	}

	// pick up scents and make movement decisions based on the scents around it
	nose() {
		var range = this.probeLength;
		// unit vector parallel to the movement direction
		var e_p = { x: Math.cos(this.direction), y: Math.sin(this.direction) };
		// unit vector normal to the movement direction
		var e_n = { x: Math.sin(this.direction), y: -Math.cos(this.direction) };
		var leftProbe1 = {
			x: this.x + range * (e_p.x + e_n.x),
			y: this.y + range * (e_p.y + e_n.y),
		};
		var rightProbe1 = {
			x: this.x + range * (e_p.x - e_n.x),
			y: this.y + range * (e_p.y - e_n.y),
		};
		var leftProbe2 = {
			x: this.x + range * (2 * e_p.x + e_n.x),
			y: this.y + range * (2 * e_p.y + e_n.y),
		};
		var rightProbe2 = {
			x: this.x + range * (2 * e_p.x - e_n.x),
			y: this.y + range * (2 * e_p.y - e_n.y),
		};
		var leftVal = 0;
		var rightVal = 0;
		leftVal = game.scents.ant.get(leftProbe1.x, leftProbe1.y);
		rightVal = game.scents.ant.get(rightProbe1.x, rightProbe1.y);
		leftVal = game.scents.ant.get(leftProbe2.x, leftProbe2.y);
		rightVal = game.scents.ant.get(rightProbe2.x, rightProbe2.y);
		if (this.cargo == "sugar") {
			leftVal += game.scents.nest.get(leftProbe1.x, leftProbe1.y);
			rightVal += game.scents.nest.get(rightProbe1.x, rightProbe1.y);
			leftVal += game.scents.nest.get(leftProbe2.x, leftProbe2.y);
			rightVal += game.scents.nest.get(rightProbe2.x, rightProbe2.y);
		} else if (this.idle == true) {
			leftVal += game.scents.sugar.get(leftProbe1.x, leftProbe1.y);
			rightVal += game.scents.sugar.get(rightProbe1.x, rightProbe1.y);
			leftVal += game.scents.sugar.get(leftProbe2.x, leftProbe2.y);
			rightVal += game.scents.sugar.get(rightProbe2.x, rightProbe2.y);
		}
		if (leftVal > rightVal) this.direction -= Math.random() * 0.5;
		if (leftVal < rightVal) this.direction += Math.random() * 0.5;
	}

	// emit ant scent
	emitAntScent() {
		game.scents.ant.push(this.x, this.y, this.scentStrength + this.idleScentStrength);
		if (this.cargo == "sugar") game.scents.sugar.push(this.x, this.y, 3);
		if (this.idle == true) game.scents.nest.push(this.x, this.y, 1);
	}

	// search for objects in the current location and possibly interact
	detectObjects() {
		// objects at the current location
		for (var obj of game.objMap.get(this.x, this.y)) obj.detect(this);

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
		var objArray = game.objMap.get(leftProbe.x, leftProbe.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].leftProbeDetect(this);
			}
		objArray = game.objMap.get(rightProbe.x, rightProbe.y);
		if (objArray.length > 0)
			for (var i = 0; i < objArray.length; i++) {
				objArray[i].rightProbeDetect(this);
			}
	}

	// carry some sugar
	take_sugar(sugar) {
		this.image.src = "res/antWithSugar.png";
		this.direction += Math.PI;
		this.idle = false;
		this.cargo = "sugar";
		sugar.amount--;
		if (sugar.amount < 1) {
			game.remove_object(sugar);
			game.add_object(new Sugar());
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
		this.score++;
	}

	// emit a stronger scent for a while
	excite() {
		this.scentStrength = 2;
		var curAnt = this;
		setTimeout(function () {
			curAnt.scentStrength = 0;
		}, 7500 * game.time_scale);
	}

}

AntCounter = 0;
