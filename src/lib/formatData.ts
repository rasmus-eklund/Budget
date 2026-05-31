export const dateToString = (date: Date) =>
  date.toLocaleDateString("sv-SE", {
    dateStyle: "short",
  });

export const toSek = (num: number) =>
  num === 0
    ? "-"
    : num.toLocaleString("sv-SE", {
        style: "currency",
        currency: "SEK",
        useGrouping: true,
      });
