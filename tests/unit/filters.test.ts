import { describe, expect, it } from "vitest";
import { haversineMiles } from "@/lib/geo/distance";
import { nearestSite, passesAge, passesDistance, passesGroup, sortSitesByDistance } from "@/lib/match/filters";
import { boston, la, makeCard } from "./fixtures";

describe("haversineMiles", () => {
  it("is ~0 for the same point and symmetric", () => {
    expect(haversineMiles(boston as { lat: number; lon: number }, boston as { lat: number; lon: number })).toBeCloseTo(0, 6);
  });
  it("Boston to Los Angeles is about 2,600 miles", () => {
    const d = haversineMiles({ lat: 42.3389, lon: -71.1055 }, { lat: 34.0689, lon: -118.4452 });
    expect(d).toBeGreaterThan(2550);
    expect(d).toBeLessThan(2650);
  });
});

describe("filters", () => {
  it("group filter (other = any)", () => {
    expect(passesGroup(makeCard(), "breast")).toBe(true);
    expect(passesGroup(makeCard(), "lung")).toBe(false);
    expect(passesGroup(makeCard(), "other")).toBe(true);
  });
  it("age filter with open bounds", () => {
    expect(passesAge({ minAge: 18, maxAge: 70 }, 71)).toBe(false);
    expect(passesAge({ minAge: 18, maxAge: 70 }, 17)).toBe(false);
    expect(passesAge({ minAge: null, maxAge: null }, 100)).toBe(true);
    expect(passesAge({ minAge: 18, maxAge: 70 }, 70)).toBe(true);
  });
  it("sorts sites nearest first, unknown coordinates last", () => {
    const noCoords = { facility: "X", city: "Y", state: "Z", zip: "00000" };
    const sorted = sortSitesByDistance([noCoords, la, boston], { lat: 42.36, lon: -71.06 });
    expect(sorted.map((s) => s.site.facility)).toEqual(["Boston site", "LA site", "X"]);
    expect(sorted[2]?.miles).toBeNull();
    expect(sortSitesByDistance([boston], null)[0]?.miles).toBeNull();
  });
  it("distance filter", () => {
    const origin = { lat: 42.36, lon: -71.06 };
    expect(passesDistance(nearestSite([la, boston], origin), 25)).toBe(true);
    expect(passesDistance(nearestSite([la], origin), 500)).toBe(false);
    expect(passesDistance(nearestSite([la], origin), null)).toBe(true);
    expect(passesDistance(nearestSite([], origin), null)).toBe(false);
    expect(passesDistance(null, 100)).toBe(false);
    expect(passesDistance(nearestSite([la], null), 100)).toBe(false);
  });
});
