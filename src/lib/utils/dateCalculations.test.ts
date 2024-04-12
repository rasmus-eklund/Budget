import { describe, expect, it } from "vitest";
import {
  decrementDay,
  minusOneMonth,
  incrementDay,
  plusOneMonth,
  getFromTo,
  getYearRange,
} from "./dateCalculations";

describe("Change date", () => {
  describe("month", () => {
    it("should minus one month", () => {
      const dates = {
        from: new Date("2020-02-01"),
        to: new Date("2020-03-01"),
      };
      const expected = {
        from: new Date("2020-01-01"),
        to: new Date("2020-02-01"),
      };
      const result = minusOneMonth(dates);
      expect(result).toEqual(expected);
    });
    it("should plus one month", () => {
      const dates = {
        from: new Date("2020-01-01"),
        to: new Date("2020-02-01"),
      };
      const expected = {
        from: new Date("2020-02-01"),
        to: new Date("2020-03-01"),
      };
      const result = plusOneMonth(dates);
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
    const { from, to } = getFromTo(data);
    expect(from).toStrictEqual(data[0]?.datum);
    expect(to).toStrictEqual(data[3]?.datum);
  });
});
