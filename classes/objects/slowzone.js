
//Klasse fuer Langsame Zonen
Slowzone = function(x, y, width, height){
	Obj.call(this);
	
	this.x = x || window.innerWidth*Math.random();	//x-Position [int]
	this.y = y || window.innerHeight*Math.random();	//y-Position [int]
	this.image.src="../res/slowzone.png";
	this.image.width = width || 150;
	this.image.height = height || 150;
	this.detectable = true;
	objMap.pushArea(this.x, this.y, this.image.width, this.image.height, this);

	
	this.toString = function(){
		return "Slowzone #"+this.id;
	}
	
	this.detect = function(by){
		if(by.speed==3){
			setTimeout(function(){by.speed=3;}, 2000*t__);
			by.speed = 1;
		}
	}
}