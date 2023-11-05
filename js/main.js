//Spielzeit
t__ = 0.2;





//Canvas synchronisieren
function syncCanvas(){
	canvasIntvl = setInterval(function(){
		var canvas = document.getElementById("frame");
		var context = canvas.getContext("2d");
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		redraw(canvas, context);
	}, 20);
	syncOverlay();
}


function syncOverlay(){
	overlayIntvl = setInterval(function(){
		canvas = document.getElementById("overlay");
		context = canvas.getContext("2d");
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		overlay(canvas, context);
	}, 90);	
}


function stopCanvasSync(){
	if(typeof(canvasIntvl) != "undefined") clearInterval(canvasIntvl);
	if(typeof(overlayIntvl) != "undefined") clearInterval(overlayIntvl);
}

//Objekte und Umgebung zeichnen
function redraw(canvas, context){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<objs.length; i++){
		curObj = objs[i];
		var x = curObj.getX();
		var y = curObj.getY();
		drawRotated(context, curObj.image, x, y, curObj.direction);
	}
}

//Debug Overlay
function overlay(canvas, context){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(n in monitorAromas){
		var mem = monitorAromas[n].obj.memory;
		for(var i=0; i<mem.length; i++){
			for(var j=0; j<mem[i].length; j++){
				var val = mem[i][j]/monitorAromas[n].max;
				if(val>1) val=1;
				context.fillStyle = "rgba("+monitorAromas[n].r+", "+monitorAromas[n].g+", "+monitorAromas[n].b+", "+val+")";
				context.fillRect(i*antAroma.resolution, j*antAroma.resolution, antAroma.resolution, antAroma.resolution);
			}
		}		
	}

	/*
	var mem = objMap.memory;
	for(var i=0; i<mem.length; i++){
		if(typeof(mem[i])!="undefined")
		for(var j=0; j<mem[i].length; j++){
			if(typeof(mem[i][j])!="undefined") context.fillStyle = "#F00";
			else context.fillStyle = "#FFF";
			context.fillRect(i*objMap.resolution, j*objMap.resolution, objMap.resolution, objMap.resolution);
		}
	}
	*/
}



//Hilfsfunktion um Objekte gedreht zu malen
function drawRotated(context, image, x, y, angle) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
    context.restore();
}


window.onresize = function(){
	stopCanvasSync();
	setTimeout(function(){
		syncCanvas();
	}, 10);
}

window.onload = function(){
	window.onresize();
	setTimeout(function(){
		for(var i = 0 ; i<1; i++) new Nest(280, 280);
		for(var i = 0 ; i<2; i++) new Obstacle();
		for(var i = 0 ; i<1; i++) new Slowzone();
		for(var i = 0 ; i<0; i++) new Portal();
		for(var i = 0 ; i<3; i++) new Sugar();
		for(var i = 0 ; i<80; i++) new Ant(250, 250, undefined, 24);
		
		//Aroma Overlay
		sugarAroma.monitor(0, 0, 255, 37);
		antAroma.monitor(255, 0, 0, 80);
		nestAroma.monitor(220, 220, 0, 30);
		
		//Grenzen
		/*
		new Obstacle(-25, window.innerHeight/2-25, 50, window.innerHeight+50);
		new Obstacle(window.innerWidth+25, window.innerHeight/2-25, 50, window.innerHeight+50);
		new Obstacle(window.innerWidth/2-25, -25, window.innerWidth+50, 50);
		new Obstacle(window.innerWidth/2-25, window.innerHeight+25, window.innerWidth+60, 50);
		*/
	})
}


document.onclick = function(e){
 var x = e.pageX;
 var y = e.pageY;
 antAroma.push(x, y, 100);
}


//Evolution
function dieLowScoreAnt(){
	var min = ants[0].score;
	var curAnt = ants[0];
	for(i in ants){
		if(ants[i].score<min) curAnt = ants[i];
	}
	var prev = curAnt.probeLength;
	curAnt.die();
	return Math.round(prev);
}

function reproduceTopScoreAnt(){
	var max = ants[0].score;
	var curAnt = ants[0];
	for(i in ants){
		if(ants[i].score>max) curAnt = ants[i];
	}
	var variation = (Math.random()-0.5)*20;
	new Ant(250, 250, undefined, curAnt.probeLength);
	new Ant(250, 250, undefined, curAnt.probeLength+variation);
	var prev = curAnt.probeLength;
	curAnt.die();
	return Math.round(prev);
}

function resetAntScores(){
	for(i in ants){
		ants[i].score = 0;
	}
}

function evolveAnts(strength){
	strength = strength || 1;
	var a = [];
	var b = [];
	for(var i=0;i<strength;i++){
		a.push(dieLowScoreAnt());
	}
	for(var i=0;i<strength;i++){
		b.push(reproduceTopScoreAnt());
	}
	resetAntScores();
	console.log("Inefficient:", a);
	console.log("Efficient:", b);
	console.log("Evolved "+strength+" ants of the colony. New Average ProbeLength: "+Math.round(100*averageProbeLength())/100+" +/- "+Math.round(100*ProbeLengthVariance())/100);
}

function averageProbeLength(){
	var sum = 0;
	for(i in ants) sum += ants[i].probeLength;
	return sum/ants.length;
}

function ProbeLengthVariance(){
	var avg = averageProbeLength();
	var sum = 0;
	for(i in ants) sum += Math.pow(ants[i].probeLength-avg, 2);
	return Math.sqrt(sum/(ants.length-1));	
}


//Debug
function newAnts(n){for(var i=0;i<n;i++)new Ant();}
function undoObj(){objs[objs.length-1].die();}
function undoObj_alt(){objs=objs.slice(0,-1);objMap.rebuild();}


