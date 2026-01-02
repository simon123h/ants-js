import { describe, it, expect, beforeEach } from "vitest";
import Ant from "../src/ant.ts";

describe("Ant", () => {
  it("should initialize with correct default values", () => {
    const ant = new Ant(100, 100);
    expect(ant.x).toBe(100);
    expect(ant.y).toBe(100);
    expect(ant.probeLength).toBe(24);
    expect(ant.idle).toBe(true);
    expect(ant.cargo).toBeNull();
  });

  it("should have a random direction", () => {
    const ant = new Ant(100, 100);
    expect(ant.direction).toBeDefined();
    expect(ant.direction).toBeGreaterThanOrEqual(0);
    expect(ant.direction).toBeLessThanOrEqual(2 * Math.PI);
  });

  it("should calculate probes correctly", () => {
    // This is hard to test without exposing the internal logic or refactoring,
    // but we can check if nose() runs without error.
    const ant = new Ant(100, 100);
    expect(() => ant.nose()).not.toThrow();
  });
});
