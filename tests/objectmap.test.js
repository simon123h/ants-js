import { describe, it, expect } from 'vitest';
import ObjectMap from '../js/objectmap.js';

describe('ObjectMap', () => {
  it('should initialize with correct resolution', () => {
    const map = new ObjectMap(20);
    expect(map.resolution).toBe(20);
  });

  it('should add an object to the map', () => {
    const map = new ObjectMap(10);
    const obj = { x: 15, y: 15 };
    map.push(obj.x, obj.y, obj);
    
    // 15/10 = 1.5 -> floor(1.5) = 1
    const objectsAtLoc = map.get(15, 15);
    expect(objectsAtLoc).toContain(obj);
  });

  it('should return empty array for empty location', () => {
    const map = new ObjectMap(10);
    const objectsAtLoc = map.get(5, 5);
    expect(objectsAtLoc).toEqual([]);
  });
});
