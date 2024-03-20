import { type FromTo } from "~/zodSchemas";

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
export const incrementMonth = (
  year: number,
  month: number,
): [number, number] => {
  if (month < 11) {
    return [year, month + 1];
  } else {
    return [year + 1, 0];
  }
};
export const decrementMonth = (
  year: number,
  month: number,
): [number, number] => {
  if (month > 0) {
    return [year, month - 1];
  } else {
    return [year - 1, 11];
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
