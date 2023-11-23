export const toDate = (date: Date) =>
  date.toLocaleDateString("sv-SE", {
    dateStyle: "short",
  });

export const toSek = (num: number) =>
  num.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    useGrouping: true,
  });
