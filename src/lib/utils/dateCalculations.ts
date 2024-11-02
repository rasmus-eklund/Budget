import { type FromTo } from "~/lib/zodSchemas";
import { dateToString } from "./formatData";

export const incrementDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);
  return nextDate;
};

export const decrementDay = (date: Date) => {
  const prevDate = new Date(date);
  prevDate.setDate(date.getDate() - 1);
  return prevDate;
};

export const incrementMonth = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  if (month < 11) {
    return { year, month: month + 1 };
  } else {
    return { year: year + 1, month: 0 };
  }
};
export const decrementMonth = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  if (month > 0) {
    return { year, month: month - 1 };
  } else {
    return { year: year - 1, month: 11 };
  }
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
