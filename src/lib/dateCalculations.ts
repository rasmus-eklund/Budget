import { Temporal } from "@js-temporal/polyfill";
import { type FromTo } from "~/lib/zodSchemas";
import { dateToString } from "./formatData";

type YM = { year: number; month: number };
export type PeriodGroupBy = "month" | "year";

export const toPlainDate = (input: string | Temporal.PlainDate | Date): Temporal.PlainDate => {
  if (input instanceof Temporal.PlainDate) {
    return input;
  }
  if (input instanceof Date) {
    if (isNaN(input.getTime())) {
      throw new Error("Invalid date format. Expected 'YYYY-MM-DD'.");
    }
    const year = input.getFullYear();
    const month = String(input.getMonth() + 1).padStart(2, "0");
    const day = String(input.getDate()).padStart(2, "0");
    return Temporal.PlainDate.from(`${year}-${month}-${day}`);
  }
  if (typeof input === "string") {
    const datePart = input.split("T")[0]!;
    try {
      return Temporal.PlainDate.from(datePart);
    } catch {
      throw new Error("Invalid date format. Expected 'YYYY-MM-DD'.");
    }
  }
  throw new Error("Invalid date format. Expected 'YYYY-MM-DD'.");
};

export const decrementDay = (date: Temporal.PlainDate | Date): FromTo => {
  const pDate = toPlainDate(date);
  const prev = pDate.subtract({ days: 1 });
  return { from: prev, to: prev };
};

export const incrementDay = (date: Temporal.PlainDate | Date): FromTo => {
  const pDate = toPlainDate(date);
  const next = pDate.add({ days: 1 });
  return { from: next, to: next };
};

export const incrementMonth = ({ year, month }: YM) => {
  const ym = Temporal.PlainYearMonth.from({ year, month }).add({ months: 1 });
  return { year: ym.year, month: ym.month };
};

export const decrementMonth = ({ year, month }: YM) => {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  const ym = Temporal.PlainYearMonth.from({ year, month }).subtract({ months: 1 });
  return { year: ym.year, month: ym.month };
};

export const getLastMonthYear = (range: FromTo) =>
  getMonthRange({
    month: range.to.month,
    year: range.to.year,
  });

export const getYearRange = ({ from, to }: FromTo) => {
  const start = from.year;
  const end = to.year;
  const range: number[] = [];
  for (let year = start; year <= end; year++) {
    range.push(year);
  }
  return range;
};

const isFirstDayOfMonth = (date: Temporal.PlainDate) => date.day === 1;

const isLastDayOfMonth = (date: Temporal.PlainDate) => date.day === date.daysInMonth;

const isFirstDayOfYear = (date: Temporal.PlainDate) => date.month === 1 && date.day === 1;

const isLastDayOfYear = (date: Temporal.PlainDate) => date.month === 12 && date.day === 31;

const minDate = (a: Temporal.PlainDate, b: Temporal.PlainDate) =>
  Temporal.PlainDate.compare(a, b) <= 0 ? a : b;

const getLastCompletedPeriodEnd = (groupBy: PeriodGroupBy, now: Temporal.PlainDate) => {
  if (groupBy === "year") {
    return Temporal.PlainDate.from({ year: now.year - 1, month: 12, day: 31 });
  }

  const prevMonth = Temporal.PlainYearMonth.from({ year: now.year, month: now.month }).subtract({
    months: 1,
  });
  return Temporal.PlainDate.from({
    year: prevMonth.year,
    month: prevMonth.month,
    day: prevMonth.daysInMonth,
  });
};

const getAverageMonthBounds = ({ from, to }: FromTo, now: Temporal.PlainDate) => {
  const firstMonth = isFirstDayOfMonth(from)
    ? Temporal.PlainDate.from({ year: from.year, month: from.month, day: 1 })
    : Temporal.PlainYearMonth.from({ year: from.year, month: from.month })
        .add({ months: 1 })
        .toPlainDate({ day: 1 });

  const effectiveTo = minDate(to, getLastCompletedPeriodEnd("month", now));

  const lastMonth = isLastDayOfMonth(effectiveTo)
    ? Temporal.PlainDate.from({ year: effectiveTo.year, month: effectiveTo.month, day: 1 })
    : Temporal.PlainYearMonth.from({ year: effectiveTo.year, month: effectiveTo.month })
        .subtract({ months: 1 })
        .toPlainDate({ day: 1 });

  return { firstMonth, lastMonth };
};

const getAverageYearBounds = ({ from, to }: FromTo, now: Temporal.PlainDate) => {
  const firstYear = isFirstDayOfYear(from) ? from.year : from.year + 1;
  const effectiveTo = minDate(to, getLastCompletedPeriodEnd("year", now));
  const lastYear = isLastDayOfYear(effectiveTo) ? effectiveTo.year : effectiveTo.year - 1;

  return { firstYear, lastYear };
};

export const getPeriodCount = (
  { from, to }: FromTo,
  groupBy: PeriodGroupBy,
  nowInput: Temporal.PlainDate | Date = Temporal.Now.plainDateISO(),
) => {
  const now = toPlainDate(nowInput);
  if (groupBy === "year") {
    const { firstYear, lastYear } = getAverageYearBounds({ from, to }, now);
    return Math.max(0, lastYear - firstYear + 1);
  }

  const { firstMonth, lastMonth } = getAverageMonthBounds({ from, to }, now);
  if (Temporal.PlainDate.compare(firstMonth, lastMonth) > 0) {
    return 0;
  }
  const yearDiff = lastMonth.year - firstMonth.year;
  const monthDiff = lastMonth.month - firstMonth.month;
  return Math.max(0, yearDiff * 12 + monthDiff + 1);
};

export const isPeriodIncludedInAverage = (
  period: string,
  groupBy: PeriodGroupBy,
  range: FromTo,
  nowInput: Temporal.PlainDate | Date = Temporal.Now.plainDateISO(),
) => {
  const now = toPlainDate(nowInput);
  if (groupBy === "year") {
    const year = Number(period);
    if (!Number.isInteger(year)) {
      return false;
    }

    const { firstYear, lastYear } = getAverageYearBounds(range, now);
    return year >= firstYear && year <= lastYear;
  }

  const [year, month] = period.split("-").map(Number);
  if (!year || !month) {
    return false;
  }

  const periodStart = Temporal.PlainDate.from({ year, month, day: 1 });
  const { firstMonth, lastMonth } = getAverageMonthBounds(range, now);
  return (
    Temporal.PlainDate.compare(periodStart, firstMonth) >= 0 &&
    Temporal.PlainDate.compare(periodStart, lastMonth) <= 0
  );
};

export const getFromTo = <T extends { datum: Temporal.PlainDate }>(txs: T[]) => {
  if (!txs[0]) {
    return false;
  }
  let from = txs[0].datum;
  let to = txs[0].datum;

  for (const { datum } of txs) {
    if (Temporal.PlainDate.compare(datum, from) < 0) {
      from = datum;
    }
    if (Temporal.PlainDate.compare(datum, to) > 0) {
      to = datum;
    }
  }

  return { from, to };
};

export const FromToString = ({ from, to }: FromTo) => {
  return `${dateToString(from)} - ${dateToString(to)}`;
};

export const eachDayOfInterval = ({ from, to }: FromTo) => {
  if (Temporal.PlainDate.compare(to, from) < 0) {
    throw new RangeError("Invalid interval: end date must be after or equal to the start date");
  }

  const dates: Temporal.PlainDate[] = [];
  let current = from;

  while (Temporal.PlainDate.compare(current, to) <= 0) {
    dates.push(current);
    current = current.add({ days: 1 });
  }

  return dates;
};

export const getMonthRange = ({ year, month }: YM): FromTo => {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  const from = Temporal.PlainDate.from({ year, month, day: 1 });
  const to = Temporal.PlainDate.from({ year, month, day: from.daysInMonth });
  return { from, to };
};

export const getDayRange = (dateInput: string | Temporal.PlainDate | Date): FromTo => {
  const pDate = toPlainDate(dateInput);
  return { from: pDate, to: pDate };
};

export const getToDay = (toString: string): Temporal.PlainDate => toPlainDate(toString);

export const getFromDay = (fromString: string): Temporal.PlainDate => toPlainDate(fromString);

export const isSameDayRange = ({ from, to }: FromTo) => from.equals(to);

export const isFullMonthRange = ({ from, to }: FromTo) =>
  from.year === to.year && from.month === to.month && from.day === 1 && to.day === from.daysInMonth;

export const isFullYearRange = ({ from, to }: FromTo) =>
  from.year === to.year && from.month === 1 && from.day === 1 && to.month === 12 && to.day === 31;
