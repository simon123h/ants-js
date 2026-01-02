import { describe, it, expect } from "vitest";
import GameObject from "../src/gameobject";

describe("GameObject", () => {
  it("should initialize with given coordinates", () => {
    const obj = new GameObject(100, 200);
    expect(obj.x).toBe(100);
    expect(obj.y).toBe(200);
  });

  it("should initialize with random coordinates if none provided", () => {
    const obj = new GameObject();
    expect(obj.x).toBeDefined();
    expect(obj.y).toBeDefined();
  });

  it("should have a default direction of 0", () => {
    const obj = new GameObject(10, 10);
    expect(obj.direction).toBe(0);
  });

  it("should respond to method calls without error", () => {
    const obj = new GameObject(10, 10);
    expect(() => obj.step()).not.toThrow();
    expect(() => obj.detect({})).not.toThrow();
    expect(() => obj.leftProbeDetect({})).not.toThrow();
    expect(() => obj.rightProbeDetect({})).not.toThrow();
  });

  it("should draw itself onto the canvas context", () => {
    const obj = new GameObject(10, 10);
    // Mock canvas context
    const context = {
      save: () => {},
      translate: () => {},
      rotate: () => {},
      drawImage: () => {},
      restore: () => {},
    } as unknown as CanvasRenderingContext2D;

    expect(() => obj.draw(context)).not.toThrow();
  });
});
