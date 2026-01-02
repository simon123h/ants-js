import { describe, it, expect } from "vitest";
import GameObject from "../src/gameobject.ts";

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
});
