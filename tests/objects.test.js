import { describe, it, expect } from "vitest";
import Nest from "../js/objects/nest.js";
import Sugar from "../js/objects/sugar.js";
import Obstacle from "../js/objects/obstacle.js";
import Slowzone from "../js/objects/slowzone.js";

describe("Game Objects", () => {
  it("Nest should initialize correctly", () => {
    const nest = new Nest(50, 50);
    expect(nest.x).toBe(50);
    expect(nest.y).toBe(50);
    expect(nest.image.src).toContain("res/nest.png");
  });

  it("Sugar should initialize correctly", () => {
    const sugar = new Sugar(100, 100);
    expect(sugar.x).toBe(100);
    expect(sugar.y).toBe(100);
    expect(sugar.amount).toBe(250);
  });

  it("Obstacle should initialize correctly", () => {
    const obstacle = new Obstacle(200, 200, 50, 50);
    expect(obstacle.x).toBe(200);
    expect(obstacle.y).toBe(200);
    expect(obstacle.width).toBe(50);
    expect(obstacle.height).toBe(50);
  });

  it("Slowzone should initialize correctly", () => {
    const slowzone = new Slowzone(300, 300, 60, 60, 5);
    expect(slowzone.x).toBe(300);
    expect(slowzone.y).toBe(300);
    expect(slowzone.factor).toBe(5);
  });
});
