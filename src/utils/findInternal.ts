import { type Internal } from "~/types";
import { dateToString } from "~/utils/formatData";
import { type Tx } from "~/zodSchemas";

export const findInternal = (day: Internal[]) => {
  const counts = countDuplicates(day);
  const internal = counts.flatMap(({ ids }) => {
    const txs = day.filter((tx) => ids.includes(tx.id));
    if (txs.length % 2 === 0 && sumBelopp(txs) === 0) {
      const halfIncome = txs
        .map((i) => (i.typ === "Insättning" ? -1 : 1))
        .reduce((p, c) => p + c, 0);
      const differentAccounts = new Set(txs.map((i) => i.konto));
      if (halfIncome === 0 && differentAccounts.size > 1) {
        return txs;
      }
      return [];
    } else if (txs.length % 2 === 1) {
      if (txs.length === 3) {
        const theOne = findInternalOddThree(txs);
        return theOne ? theOne : [];
      }
    }
    return [];
  });
  return internal.map((i) => i.id);
};

const findInternalOddThree = (txs: Internal[]) => {
  const totalSum = sumBelopp(txs);
  const accounts: Record<string, Internal[]> = {};
  txs.forEach((tx) => {
    if (!accounts[tx.konto]) {
      accounts[tx.konto] = [];
    }
    accounts[tx.konto]!.push(tx);
  });

  const groupAccount = Object.keys(accounts).find(
    (key) => accounts[key]!.length > 1,
  );

  if (!groupAccount) {
    throw new Error("Cound not find the one...");
  }

  const matchingTransaction = accounts[groupAccount]!.find(
    (transaction) => transaction.belopp === totalSum,
  );
  if (matchingTransaction) {
    return txs.filter((i) => i.id !== matchingTransaction.id);
  }
  return [];
};

export const sumBelopp = <T extends { belopp: number }>(obj: T[]) =>
  obj.reduce((p, c) => p + c.belopp, 0);

export const countDuplicates = <T extends { belopp: number; id: string }>(
  items: T[],
) => {
  const tracker: Record<
    string,
    { count: number; belopp: number; ids: string[] }
  > = {};

  items.forEach(({ belopp, id }) => {
    const key = Math.abs(belopp).toString();
    if (!tracker[key]) {
      tracker[key] = { count: 1, belopp: Math.abs(belopp), ids: [id] };
    } else {
      tracker[key]!.count++;
      tracker[key]!.ids.push(id);
    }
  });

  return Object.values(tracker).filter(({ count }) => count > 1);
};

export const markInternal = (txs: (Tx & { id: string })[]) => {
  const internal = distinctDates(txs).flatMap((date) => {
    const day = getDay(txs, date);
    if (!hasDuplicates(day)) return [];
    return findInternal(day);
  });
  return txs.map((tx) => ({
    ...tx,
    budgetgrupp: internal.some((i) => i === tx.id) ? "inom" : tx.budgetgrupp,
  }));
};

export const hasDuplicates = <T extends { belopp: number }>(day: T[]) =>
  new Set(day.map((i) => Math.abs(i.belopp))).size !== day.length;

export const distinctDates = <T extends { datum: Date }>(dates: T[]) =>
  [...new Set(dates.map(({ datum }) => dateToString(datum)))].map(stringToDate);

export const stringToDate = (s: string) => new Date(s);

export const getDay = <T extends { datum: Date }>(txs: T[], target: Date) =>
  txs.filter((tx) => isSameDate(tx, target));

export const isSameDate = <T extends { datum: Date }>(obj: T, target: Date) =>
  dateToString(obj.datum) === dateToString(target);
