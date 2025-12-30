import { game } from "./game.js";
import Ant from "./ant.js";

// Evolution of ants

function killLowScoreAnt() {
  let min = game.ants[0].stats.score;
  let my_ant = game.ants[0];
  for (const ant of game.ants) if (ant.stats.score < min) my_ant = ant;
  const prev = my_ant.probeLength;
  game.remove_object(my_ant);
  return Math.round(prev);
}

function reproduceTopScoreAnt() {
  let max = game.ants[0].stats.score;
  let my_ant = game.ants[0];
  for (const ant of game.ants) if (ant.stats.score > max) my_ant = ant;
  const variation = (Math.random() - 0.5) * 10;
  const nest = game.get_nest();
  const ant = new Ant(nest.x, nest.y, my_ant.probeLength + variation);
  ant.speed *= 1 + 0.4 * (Math.random() - 0.5);
  ant.default_speed = ant.speed;
  game.add_object(ant);
  const prev = my_ant.probeLength;
  my_ant.stats.score = 0;
  return Math.round(prev);
}

export function evolveAnts(strength) {
  strength = strength || 1;
  const a = [];
  const b = [];
  for (let i = 0; i < strength; i++) a.push(killLowScoreAnt());
  for (let i = 0; i < strength; i++) b.push(reproduceTopScoreAnt());
  for (const ant of game.ants) ant.stats.score = 0;
  // console.log("Inefficient:", a);
  // console.log("Efficient:", b);
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
  let sum = 0;
  for (const ant of game.ants) sum += ant.probeLength;
  return sum / game.ants.length;
}

function ProbeLengthVariance() {
  const avg = averageProbeLength();
  let sum = 0;
  for (const ant of game.ants) sum += Math.pow(ant.probeLength - avg, 2);
  return Math.sqrt(sum / (game.ants.length - 1));
}
