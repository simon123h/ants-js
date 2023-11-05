

sugarAroma = new Aroma();

//Klasse fuer Zucker
Sugar = function(x, y){
	Obj.call(this);
	
	// // Attribute // //
	this.x = x || window.innerWidth*Math.random();	//x-Position [int]
	this.y = y || window.innerHeight*Math.random();	//y-Position [int]
	this.portable = true;
	this.image.src = "../res/sugar.png";
	this.detectable = true;
	this.image.width = 35;
	this.image.height = 35;
	this.amount = 250;
	this.aromaStrength = 10;
	objMap.pushArea(this.x, this.y, 45, 45, this);
		
	
	this.toString = function(){
		return "Sugar #"+this.id;
	}
	
	this.detect = function(by){
		if(by.idle){
			by.takeSugar(this);
		}
	}
	
	this.active = function(){
		var curSugar = this;
		this.activeInterval = setInterval(function(){
			antAroma.push(curSugar.x, curSugar.y, curSugar.aromaStrength);
		}, 1100*t__);
	}
	this.active();
	
	this.stop = function(){
		clearInterval(this.activeInterval);
	}
	
	this.die = function(){
		this.stop();
		var index = objs.indexOf(this);
		objs.splice(index, 1);
		objMap.rebuild();
	}
	
}