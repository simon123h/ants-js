// Evolution of ants

function killLowScoreAnt() {
  var min = game.ants[0].stats.score;
  var my_ant = game.ants[0];
  for (var ant of game.ants)
    if (ant.stats.score < min) my_ant = ant;
  var prev = my_ant.probeLength;
  game.remove_object(my_ant);
  return Math.round(prev);
}

function reproduceTopScoreAnt() {
  var max = game.ants[0].stats.score;
  var my_ant = game.ants[0];
  for (var ant of game.ants)
    if (ant.stats.score > max) my_ant = ant;
  var variation = (Math.random() - 0.5) * 10;
  var nest = game.get_nest();
  var ant = new Ant(nest.x, nest.y, my_ant.probeLength + variation);
  ant.speed *= 1 + 0.4 * (Math.random() - 0.5);
  ant.default_speed = ant.speed;
  game.add_object(ant);
  var prev = my_ant.probeLength;
  my_ant.stats.score = 0;
  return Math.round(prev);
}

function evolveAnts(strength) {
  strength = strength || 1;
  var a = [];
  var b = [];
  for (var i = 0; i < strength; i++)
    a.push(killLowScoreAnt());
  for (var i = 0; i < strength; i++)
    b.push(reproduceTopScoreAnt());
  for (var ant of game.ants)
    ant.stats.score = 0;
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
  for (var ant of game.ants) sum += ant.probeLength;
  return sum / game.ants.length;
}

function ProbeLengthVariance() {
  var avg = averageProbeLength();
  var sum = 0;
  for (var ant of game.ants) sum += Math.pow(ant.probeLength - avg, 2);
  return Math.sqrt(sum / (game.ants.length - 1));
}
