import { type Internal } from "~/types";
import { dateToString } from "~/lib/utils/formatData";
import type { TxBankAccount } from "~/lib/zodSchemas";

export const findInternal = (day: Internal[]) => {
  const internal: Internal[] = [];
  const counts = countDuplicates(day);

  for (const { ids } of counts) {
    const txs = day.filter((tx) => ids.includes(tx.id));
    const totalSum = sumBelopp(txs);
    if (txs.length % 2 === 0 && totalSum === 0) {
      const halfIncome = txs
        .map((i) => (i.typ === "Insättning" ? -1 : 1))
        .reduce((p, c) => p + c, 0);
      const differentAccounts = new Set(txs.map((i) => i.bankAccountId));
      if (halfIncome === 0 && differentAccounts.size > 1) {
        internal.push(...txs);
      }
    } else if (txs.length % 2 === 1 && txs.length === 3) {
      const theOne = findInternalOddThree(txs, totalSum);
      if (theOne) {
        internal.push(...theOne);
      }
    }
  }

  return internal.map((i) => i.id);
};

const findInternalOddThree = (txs: Internal[], totalSum: number) => {
  const accounts: Record<string, Internal[]> = {};
  for (const tx of txs) {
    const { bankAccountId } = tx;
    if (!accounts[bankAccountId]) {
      accounts[bankAccountId] = [];
    }
    accounts[bankAccountId]!.push(tx);
  }
  const groupAccount = Object.keys(accounts).find(
    (key) => accounts[key]!.length > 1,
  );
  if (!groupAccount) {
    throw new Error("Cound not find the one...\n" + JSON.stringify(txs));
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

  for (const { belopp, id } of items) {
    const key = Math.abs(belopp);
    if (!tracker[key]) {
      tracker[key] = { count: 1, belopp: Math.abs(belopp), ids: [id] };
    } else {
      tracker[key]!.count++;
      tracker[key]!.ids.push(id);
    }
  }
  return Object.values(tracker).filter(({ count }) => count > 1);
};

const pause = () => {
  return new Promise((r) => setTimeout(r, 0));
};

export const markInternal = async (
  txs: TxBankAccount[],
  update: (percent: number) => void,
) => {
  const internal: string[] = [];
  const dates = distinctDates(txs);
  let counter = 0;
  for (const date of dates) {
    await pause();
    update(counter / dates.length);
    const day = getDay(txs, date);
    if (hasDuplicates(day)) {
      const foundInternal = findInternal(day);
      for (const tx of foundInternal) {
        internal.push(tx);
      }
    }
    counter++;
  }
  return txs.map((tx) => ({
    ...tx,
    budgetgrupp: internal.some((i) => i === tx.id) ? "inom" : tx.budgetgrupp,
  }));
};

export const hasDuplicates = <T extends { belopp: number }>(day: T[]) =>
  new Set(day.map((i) => Math.abs(i.belopp))).size !== day.length;

export const distinctDates = <T extends { datum: Date }>(dates: T[]) => {
  const uniqueDates: Date[] = [];
  const seenDates = new Set<string>();

  for (const { datum } of dates) {
    const dateString = dateToString(datum);
    if (!seenDates.has(dateString)) {
      uniqueDates.push(datum);
      seenDates.add(dateString);
    }
  }

  return uniqueDates;
};

export const getDay = <T extends { datum: Date }>(txs: T[], target: Date) =>
  txs.filter((tx) => isSameDate(tx, target));

export const isSameDate = <T extends { datum: Date }>(obj: T, target: Date) =>
  dateToString(obj.datum) === dateToString(target);
