import { describe, it, expect } from "vitest";
import Scent from "../js/scent.js";

describe("Scent", () => {
  it("should initialize with correct parameters", () => {
    const scent = new Scent(20, "red", 100);
    expect(scent.resolution).toBe(20);
    expect(scent.color).toBe("red");
    expect(scent.max).toBe(100);
  });

  it("should push scent value to memory", () => {
    const scent = new Scent(20, "red", 100);
    const x = 40;
    const y = 40;
    scent.push(x, y, 50);

    // 40/20 = 2
    expect(scent.get(x, y)).toBeGreaterThan(0);
  });

  it("should diffuse scent over time", () => {
    const scent = new Scent(20, "red", 100);
    scent.push(100, 100, 100);
    const initialVal = scent.get(100, 100);

    // Step multiple times to allow diffusion
    for (let i = 0; i < 10; i++) {
      scent.step();
    }

    // The value at the center should decrease due to decay and diffusion
    expect(scent.get(100, 100)).toBeLessThan(initialVal);
  });
});
