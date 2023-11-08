//Evolution
function dieLowScoreAnt() {
  var min = ants[0].score;
  var curAnt = ants[0];
  for (i in ants) {
    if (ants[i].score < min) curAnt = ants[i];
  }
  var prev = curAnt.probeLength;
  game.remove_ant(curAnt);
  return Math.round(prev);
}

function reproduceTopScoreAnt() {
  var max = ants[0].score;
  var curAnt = ants[0];
  for (i in ants) {
    if (ants[i].score > max) curAnt = ants[i];
  }
  var variation = (Math.random() - 0.5) * 20;
  new Ant(250, 250, undefined, curAnt.probeLength);
  new Ant(250, 250, undefined, curAnt.probeLength + variation);
  var prev = curAnt.probeLength;
  game.remove_ant(curAnt);
  return Math.round(prev);
}

function evolveAnts(strength) {
  strength = strength || 1;
  var a = [];
  var b = [];
  for (var i = 0; i < strength; i++) {
    a.push(dieLowScoreAnt());
  }
  for (var i = 0; i < strength; i++) {
    b.push(reproduceTopScoreAnt());
  }
  for (i in ants) {
    ants[i].score = 0;
  }
  console.log("Inefficient:", a);
  console.log("Efficient:", b);
  console.log(
    "Evolved " +
    strength +
    " ants of the colony. New Average ProbeLength: " +
    Math.round(100 * averageProbeLength()) / 100 +
    " +/- " +
    Math.round(100 * ProbeLengthVariance()) / 100,
  );
}

function averageProbeLength() {
  var sum = 0;
  for (i in ants) sum += ants[i].probeLength;
  return sum / ants.length;
}

function ProbeLengthVariance() {
  var avg = averageProbeLength();
  var sum = 0;
  for (i in ants) sum += Math.pow(ants[i].probeLength - avg, 2);
  return Math.sqrt(sum / (ants.length - 1));
}
