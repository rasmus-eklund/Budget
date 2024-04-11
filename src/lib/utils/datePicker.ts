import { type FromTo } from "~/lib/zodSchemas";

export const minusOneMonth = (p: FromTo) => {
  const from = new Date(p.from);
  const to = new Date(p.to);
  from.setMonth(from.getMonth() - 1);
  to.setMonth(to.getMonth() - 1);
  return { from, to };
};
export const minusOneDay = (p: FromTo) => {
  const from = new Date(p.from);
  const to = new Date(p.to);
  from.setDate(from.getDate() - 1);
  to.setDate(to.getDate() - 1);
  return { from, to };
};
export const plusOneDay = (p: FromTo) => {
  const from = new Date(p.from);
  const to = new Date(p.to);
  from.setDate(from.getDate() + 1);
  to.setDate(to.getDate() + 1);
  return { from, to };
};
export const plusOneMonth = (p: FromTo) => {
  const from = new Date(p.from);
  const to = new Date(p.to);
  from.setMonth(from.getMonth() + 1);
  to.setMonth(to.getMonth() + 1);
  return { from, to };
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
    from: new Date(year, month, 1),
    to: new Date(year, month + 1, 0),
  };
};
