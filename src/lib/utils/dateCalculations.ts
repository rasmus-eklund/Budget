import { type FromTo } from "~/lib/zodSchemas";
import { dateToString } from "./formatData";

type YM = { year: number; month: number };

export const decrementDay = (date: Date): FromTo => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - 1);

  const from = new Date(newDate);
  from.setHours(0, 0, 0, 0);

  const to = new Date(newDate);
  to.setHours(23, 59, 59, 999);

  return { from, to };
};

export const incrementDay = (date: Date): FromTo => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);

  const from = new Date(newDate);
  from.setHours(0, 0, 0, 0);

  const to = new Date(newDate);
  to.setHours(23, 59, 59, 999);

  return { from, to };
};

export const incrementMonth = ({ year, month }: YM) => {
  if (month < 12) {
    return { year, month: month + 1 };
  } else {
    return { year: year + 1, month: 1 };
  }
};

export const decrementMonth = ({ year, month }: YM) => {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
};

export const getCurrentYearMonth = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  return {
    from: new Date(Date.UTC(year, month, 1)),
    to: new Date(Date.UTC(year, month + 1, 0)),
  };
};

export const getYearRange = ({ from, to }: FromTo) => {
  const start = from.getFullYear();
  const end = to.getFullYear();
  const range: number[] = [];
  for (let year = start; year <= end; year++) {
    range.push(year);
  }
  return range;
};

export const getFromTo = <T extends { datum: Date }>(txs: T[]) => {
  if (!txs[0]) {
    return false;
  }
  let from = txs[0].datum;
  let to = txs[0].datum;

  for (const { datum } of txs) {
    if (datum < from) {
      from = datum;
    }
    if (datum > to) {
      to = datum;
    }
  }

  return { from, to };
};

export const FromToString = ({ from, to }: FromTo) => {
  return `${dateToString(from)} - ${dateToString(to)}`;
};

export const eachDayOfInterval = ({ from, to }: FromTo) => {
  const startDate = new Date(from);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(to);
  endDate.setHours(0, 0, 0, 0);

  if (endDate < startDate) {
    throw new RangeError(
      "Invalid interval: end date must be after or equal to the start date",
    );
  }

  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const getMonthRange = ({ year, month }: YM): FromTo => {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  const from = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const to = new Date(year, month, 0, 23, 59, 59, 999);
  return { from, to };
};

export const getDayRange = (dateString: string): FromTo => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Expected 'YYYY-MM-DD'.");
  }

  const from = new Date(date);
  from.setHours(0, 0, 0, 0);

  const to = new Date(date);
  to.setHours(23, 59, 59, 999);

  return { from, to };
};

export const getToDay = (toString: string): Date => {
  const to = new Date(toString);
  if (isNaN(to.getTime())) {
    throw new Error("Invalid date format. Expected 'YYYY-MM-DD'.");
  }
  to.setHours(23, 59, 59, 999);
  return to;
};

export const getFromDay = (fromString: string): Date => {
  const from = new Date(fromString);
  if (isNaN(from.getTime())) {
    throw new Error("Invalid date format. Expected 'YYYY-MM-DD'.");
  }
  from.setHours(0, 0, 0, 0);
  return from;
};

