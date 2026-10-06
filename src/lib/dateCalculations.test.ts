import { describe, expect, it } from "bun:test";
import { Temporal } from "@js-temporal/polyfill";
import {
  decrementDay,
  incrementDay,
  incrementMonth,
  decrementMonth,
  getFromTo,
  getPeriodCount,
  getYearRange,
  isPeriodIncludedInAverage,
  isSameDayRange,
  isFullMonthRange,
  isFullYearRange,
} from "./dateCalculations";

describe("Change date", () => {
  describe("month", () => {
    it("should decrement one month", () => {
      const date = {
        year: 2020,
        month: 2,
      };
      const expected = {
        year: 2020,
        month: 1,
      };
      const result = decrementMonth(date);
      expect(result).toEqual(expected);
    });

    it("should handle decrementing from January to December of the previous year", () => {
      const date = {
        year: 2020,
        month: 1,
      };
      const expected = {
        year: 2019,
        month: 12,
      };
      const result = decrementMonth(date);
      expect(result).toEqual(expected);
    });

    it("should increment one month", () => {
      const date = {
        year: 2020,
        month: 1,
      };
      const expected = {
        year: 2020,
        month: 2,
      };
      const result = incrementMonth(date);
      expect(result).toEqual(expected);
    });

    it("should handle incrementing from December to January of the next year", () => {
      const date = {
        year: 2020,
        month: 12,
      };
      const expected = {
        year: 2021,
        month: 1,
      };
      const result = incrementMonth(date);
      expect(result).toEqual(expected);
    });
  });
  describe("day", () => {
    it("should minus one day", () => {
      const date = Temporal.PlainDate.from("2020-01-02");
      const expected = {
        from: Temporal.PlainDate.from("2020-01-01"),
        to: Temporal.PlainDate.from("2020-01-01"),
      };

      const result = decrementDay(date);
      expect(result).toEqual(expected);
    });

    it("should plus one day", () => {
      const date = Temporal.PlainDate.from("2020-01-01");
      const expected = {
        from: Temporal.PlainDate.from("2020-01-02"),
        to: Temporal.PlainDate.from("2020-01-02"),
      };

      const result = incrementDay(date);
      expect(result).toEqual(expected);
    });
  });
});

describe("Get all years from - to", () => {
  it("should be 1 to 10", () => {
    const fromTo = {
      from: Temporal.PlainDate.from("2000-01-01"),
      to: Temporal.PlainDate.from("2010-01-01"),
    };
    const range = getYearRange(fromTo);
    expect(range).toStrictEqual([2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010]);
  });
});

describe("Get period count", () => {
  const now = Temporal.PlainDate.from("2026-06-01");

  it("excludes a partial month range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-01-15"),
      to: Temporal.PlainDate.from("2024-01-31"),
    };

    expect(getPeriodCount(range, "month", now)).toBe(0);
  });

  it("counts complete months inside partial date ranges", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-01-15"),
      to: Temporal.PlainDate.from("2024-06-10"),
    };

    expect(getPeriodCount(range, "month", now)).toBe(4);
  });

  it("counts months across years", () => {
    const range = {
      from: Temporal.PlainDate.from("2023-11-01"),
      to: Temporal.PlainDate.from("2024-02-29"),
    };

    expect(getPeriodCount(range, "month", now)).toBe(4);
  });

  it("excludes the current incomplete month", () => {
    const range = {
      from: Temporal.PlainDate.from("2026-01-01"),
      to: Temporal.PlainDate.from("2026-06-01"),
    };

    expect(getPeriodCount(range, "month", now)).toBe(5);
  });

  it("counts complete years inclusively", () => {
    const range = {
      from: Temporal.PlainDate.from("2023-01-01"),
      to: Temporal.PlainDate.from("2025-12-31"),
    };

    expect(getPeriodCount(range, "year", now)).toBe(3);
  });

  it("excludes the current incomplete year", () => {
    const range = {
      from: Temporal.PlainDate.from("2026-01-01"),
      to: Temporal.PlainDate.from("2026-12-31"),
    };

    expect(getPeriodCount(range, "year", now)).toBe(0);
  });

  it("detects whether a month period is included in the average", () => {
    const range = {
      from: Temporal.PlainDate.from("2026-01-01"),
      to: Temporal.PlainDate.from("2026-06-01"),
    };

    expect(isPeriodIncludedInAverage("2026-05", "month", range, now)).toBe(true);
    expect(isPeriodIncludedInAverage("2026-06", "month", range, now)).toBe(false);
  });
});

describe("Get max and min dates", () => {
  it("should find max and min", () => {
    const minDate = Temporal.PlainDate.from("2021-01-01");
    const maxDate = Temporal.PlainDate.from("2024-02-01");
    const data = [
      { datum: minDate },
      { datum: Temporal.PlainDate.from("2022-02-01") },
      { datum: Temporal.PlainDate.from("2023-03-01") },
      { datum: maxDate },
    ];
    const tmp = getFromTo(data);
    if (!tmp) {
      throw new Error("Could not get from and to");
    }
    const { from, to } = tmp;
    expect(from).toBe(minDate);
    expect(to).toBe(maxDate);
  });
});

describe("Range shape checks", () => {
  it("should detect same day range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-05-10"),
      to: Temporal.PlainDate.from("2024-05-10"),
    };
    expect(isSameDayRange(range)).toBe(true);
  });

  it("should detect non same day range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-05-10"),
      to: Temporal.PlainDate.from("2024-05-11"),
    };
    expect(isSameDayRange(range)).toBe(false);
  });

  it("should detect full month range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-02-01"),
      to: Temporal.PlainDate.from("2024-02-29"),
    };
    expect(isFullMonthRange(range)).toBe(true);
  });

  it("should detect non full month range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-02-02"),
      to: Temporal.PlainDate.from("2024-02-29"),
    };
    expect(isFullMonthRange(range)).toBe(false);
  });

  it("should detect full year range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-01-01"),
      to: Temporal.PlainDate.from("2024-12-31"),
    };
    expect(isFullYearRange(range)).toBe(true);
  });

  it("should detect non full year range", () => {
    const range = {
      from: Temporal.PlainDate.from("2024-01-02"),
      to: Temporal.PlainDate.from("2024-12-31"),
    };
    expect(isFullYearRange(range)).toBe(false);
  });
});
