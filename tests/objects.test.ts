import { describe, it, expect } from "vitest";
import Nest from "../src/objects/nest";
import Sugar from "../src/objects/sugar";
import Obstacle from "../src/objects/obstacle";
import Slowzone from "../src/objects/slowzone";

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

  it("Sugar should initialize with defaults", () => {
    const sugar = new Sugar();
    expect(sugar.x).toBeDefined();
    expect(sugar.y).toBeDefined();
  });

  it("Sugar detect should trigger ant to take sugar", () => {
    const sugar = new Sugar(100, 100);
    const antMock = {
      idle: true,
      take_sugar: (s: Sugar) => {
        s.amount--; // simulate taking sugar
      },
    };
    sugar.detect(antMock);
    expect(sugar.amount).toBe(249);

    // Should not take sugar if ant is not idle
    antMock.idle = false;
    sugar.detect(antMock);
    expect(sugar.amount).toBe(249);
  });

  it("Sugar step should execute without error", () => {
    const sugar = new Sugar(100, 100);
    expect(() => sugar.step()).not.toThrow();
  });

  it("Sugar draw should execute without error", () => {
    const sugar = new Sugar(100, 100);
    const context = {
      save: () => {},
      translate: () => {},
      rotate: () => {},
      drawImage: () => {},
      restore: () => {},
      fillStyle: "",
      font: "",
      textAlign: "",
      fillText: () => {},
    } as unknown as CanvasRenderingContext2D;
    expect(() => sugar.draw(context)).not.toThrow();
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
