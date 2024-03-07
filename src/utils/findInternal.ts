import { dateToString } from "~/utils/formatData";
import { type Tx } from "~/zodSchemas";

export const findInternal = (day: (Tx & { id: string })[]) => {
  const data = day.map((tx) => ({ ...tx, budgetgrupp: "övrigt" }));
  // abs belopp and count.
  const counts = countDuplicates(data);
  const internal = counts.filter(({ ids }) => {
    const txs = day.filter((tx) => ids.some((id) => id === tx.id));
    if (txs.length % 2 === 0 && sumBelopp(txs) === 0) {
      const equalPlusAndMinus = txs
        .map((i) => (i.typ.includes("Insättning") ? -1 : 1))
        .reduce((p, c) => p + c, 0);
      if (equalPlusAndMinus === 0) {
        return true;
      }
      console.log(txs);
      return false;
    }
  });

  // loop over duplicates

  return internal;
};

export const isSameDate = <T extends { datum: Date }>(obj: T, target: Date) =>
  dateToString(obj.datum) === dateToString(target);

export const sumBelopp = <T extends { belopp: number }>(obj: T[]) =>
  obj.reduce((p, c) => p + c.belopp, 0);

export const countDuplicates = <T extends { belopp: number; id: string }>(
  obj: T[],
) =>
  obj
    .reduce(
      (p, c) => {
        const found = p.find(
          ({ belopp }) => Math.abs(belopp) === Math.abs(c.belopp),
        );
        if (!found) {
          return [...p, { belopp: Math.abs(c.belopp), count: 1, ids: [c.id] }];
        }
        found.count++;
        found.ids.push(c.id);
        return p;
      },
      [] as { count: number; belopp: number; ids: string[] }[],
    )
    .filter((i) => i.count > 1);

export const stringToDate = (s: string) => new Date(s);

export const getDay = <T extends { datum: Date }>(txs: T[], target: Date) =>
  txs.filter((tx) => isSameDate(tx, target));

export const distinctDates = <T extends { datum: Date }>(dates: T[]) =>
  [...new Set(dates.map(({ datum }) => dateToString(datum)))].map(stringToDate);

export const markInternal = (txs: (Tx & { id: string })[]) => {
  const internal = distinctDates(txs).flatMap((date) =>
    findInternal(getDay(txs, date)).flatMap((i) => i.ids),
  );
  return txs.map((tx) => ({
    ...tx,
    budgetgrupp: internal.some((i) => i === tx.id) ? "inom" : tx.budgetgrupp,
  }));
};
