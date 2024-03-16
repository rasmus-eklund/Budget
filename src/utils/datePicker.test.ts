import { describe, expect, it } from "vitest";
import { minusOneDay, minusOneMonth, plusOneDay, plusOneMonth } from "./datePicker";

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
      const dates = {
        from: new Date("2020-01-02"),
        to: new Date("2020-01-03"),
      };
      const expected = {
        from: new Date("2020-01-01"),
        to: new Date("2020-01-02"),
      };
      const result = minusOneDay(dates);
      expect(result).toEqual(expected);
    });
    it("should plus one day", () => {
      const dates = {
        from: new Date("2020-01-01"),
        to: new Date("2020-01-02"),
      };
      const expected = {
        from: new Date("2020-01-02"),
        to: new Date("2020-01-03"),
      };
      const result = plusOneDay(dates);
      expect(result).toEqual(expected);
    });
  });
});
