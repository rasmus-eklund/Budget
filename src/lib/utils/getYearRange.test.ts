import { it, describe, expect } from "vitest";
import { getYearRange } from "./getYearRange";

describe("get year range", () => {
  it("should be 1 to 10", () => {
    const fromTo = { from: new Date("2000-01-01"), to: new Date("2010-01-01") };
    const range = getYearRange(fromTo);
    expect(range).toStrictEqual([
      2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
    ]);
  });
});
