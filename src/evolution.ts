import { game } from "./game";
import Ant from "./ant";

// Evolution of ants

function killLowScoreAnt(): number {
  const ants = game.ants;
  if (ants.length === 0) return 0;

  let min = ants[0].stats.score;
  let my_ant = ants[0];
  for (const ant of ants) if (ant.stats.score < min) my_ant = ant;
  const prev = my_ant.probeLength;
  game.remove_object(my_ant);
  return Math.round(prev);
}

function reproduceTopScoreAnt(): number {
  const ants = game.ants;
  if (ants.length === 0) return 0;

  let max = ants[0].stats.score;
  let my_ant = ants[0];
  for (const ant of ants) if (ant.stats.score > max) my_ant = ant;
  const variation = (Math.random() - 0.5) * 10;
  const nest = game.get_nest();
  if (!nest) return 0;

  const ant = new Ant(nest.x, nest.y, my_ant.probeLength + variation);
  ant.speed *= 1 + 0.4 * (Math.random() - 0.5);
  ant.default_speed = ant.speed;
  game.add_object(ant);
  const prev = my_ant.probeLength;
  my_ant.stats.score = 0;
  return Math.round(prev);
}

export function evolveAnts(strength: number): void {
  strength = strength || 1;
  const a: number[] = [];
  const b: number[] = [];
  for (let i = 0; i < strength; i++) a.push(killLowScoreAnt());
  for (let i = 0; i < strength; i++) b.push(reproduceTopScoreAnt());
  const ants = game.ants;
  for (const ant of ants) ant.stats.score = 0;
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

function averageProbeLength(): number {
  const ants = game.ants;
  if (ants.length === 0) return 0;
  let sum = 0;
  for (const ant of ants) sum += ant.probeLength;
  return sum / ants.length;
}

function ProbeLengthVariance(): number {
  const ants = game.ants;
  if (ants.length < 2) return 0;
  const avg = averageProbeLength();
  let sum = 0;
  for (const ant of ants) sum += Math.pow(ant.probeLength - avg, 2);
  return Math.sqrt(sum / (ants.length - 1));
}
