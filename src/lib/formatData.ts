import { Temporal } from "@js-temporal/polyfill";

export const dateToString = (date: Temporal.PlainDate | Date) => {
  if (date instanceof Temporal.PlainDate) {
    return date.toString();
  }
  return date.toLocaleDateString("sv-SE", {
    dateStyle: "short",
  });
};

export const toSek = (num: number) =>
  num === 0
    ? "-"
    : num.toLocaleString("sv-SE", {
        style: "currency",
        currency: "SEK",
        useGrouping: true,
      });
