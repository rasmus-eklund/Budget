import { describe, expect, it } from "vitest";
import {
  decrementDay,
  incrementDay,
  incrementMonth,
  decrementMonth,
  getFromTo,
  getYearRange,
} from "./dateCalculations";

describe("Change date", () => {
  describe("month", () => {
    it("should decrement one month", () => {
      const date = {
        year: 2020,
        month: 2, // March (0-indexed)
      };
      const expected = {
        year: 2020,
        month: 1, // February
      };
      const result = decrementMonth(date);
      expect(result).toEqual(expected);
    });

    it("should handle decrementing from January to December of the previous year", () => {
      const date = {
        year: 2020,
        month: 0, // January
      };
      const expected = {
        year: 2019,
        month: 11, // December of the previous year
      };
      const result = decrementMonth(date);
      expect(result).toEqual(expected);
    });

    it("should increment one month", () => {
      const date = {
        year: 2020,
        month: 0, // January
      };
      const expected = {
        year: 2020,
        month: 1, // February
      };
      const result = incrementMonth(date);
      expect(result).toEqual(expected);
    });

    it("should handle incrementing from December to January of the next year", () => {
      const date = {
        year: 2020,
        month: 11, // December
      };
      const expected = {
        year: 2021,
        month: 0, // January of the next year
      };
      const result = incrementMonth(date);
      expect(result).toEqual(expected);
    });
  });
  describe("day", () => {
    it("should minus one day", () => {
      const date = new Date("2020-01-02");
      const expected = new Date("2020-01-01");

      const result = decrementDay(date);
      expect(result).toEqual(expected);
    });
    it("should plus one day", () => {
      const date = new Date("2020-01-01");
      const expected = new Date("2020-01-02");
      const result = incrementDay(date);
      expect(result).toEqual(expected);
    });
  });
});

describe("Get all years from - to", () => {
  it("should be 1 to 10", () => {
    const fromTo = { from: new Date("2000-01-01"), to: new Date("2010-01-01") };
    const range = getYearRange(fromTo);
    expect(range).toStrictEqual([
      2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
    ]);
  });
});

describe("Get max and min dates", () => {
  it("should find max and min", () => {
    const data = [
      { datum: new Date("2021-01-01") },
      { datum: new Date("2022-02-01") },
      { datum: new Date("2023-03-01") },
      { datum: new Date("2024-04-01") },
    ];
    const tmp = getFromTo(data);
    if (!tmp) {
      throw new Error("Could not get from and to");
    }
    const { from, to } = tmp;
    expect(from).toStrictEqual(data[0]?.datum);
    expect(to).toStrictEqual(data[3]?.datum);
  });
});
