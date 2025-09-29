import { type Internal } from "~/types";
import type { TxBankAccount } from "~/lib/zodSchemas";

export const findInternal = (day: Internal[]) => {
  const internalIds = new Set<string>();
  const groups = new Map<number, Internal[]>();

  for (const tx of day) {
    const key = Math.abs(tx.belopp);
    if (!groups.has(key)) {
      groups.set(key, [tx]);
    } else {
      groups.get(key)!.push(tx);
    }
  }

  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const totalSum = sumBelopp(group);
    if (group.length % 2 === 0 && totalSum === 0) {
      let halfIncome = 0;
      for (const tx of group) {
        halfIncome += tx.belopp > 0 ? -1 : 1;
      }
      const differentAccounts = new Set(group.map((tx) => tx.bankAccountId));
      if (halfIncome === 0 && differentAccounts.size > 1) {
        for (const tx of group) {
          internalIds.add(tx.id);
        }
      }
    } else if (group.length === 3) {
      const theOne = findInternalOddThree(group, totalSum);
      for (const tx of theOne) {
        internalIds.add(tx.id);
      }
    }
  }

  return Array.from(internalIds);
};

export const sumBelopp = <T extends { belopp: number }>(obj: T[]) =>
  obj.reduce((p, c) => p + c.belopp, 0);

const findInternalOddThree = (txs: Internal[], totalSum: number) => {
  const accounts = new Map<string, Internal[]>();
  for (const tx of txs) {
    const key = tx.bankAccountId;
    if (!accounts.has(key)) {
      accounts.set(key, [tx]);
    } else {
      accounts.get(key)!.push(tx);
    }
  }
  const txArray = Array.from(accounts.values()).find(
    (txArray) => txArray.length > 1,
  );
  if (!txArray) {
    throw new Error("Could not find the one...\n" + JSON.stringify(txs));
  }
  const matchingTransaction = txArray.find(
    (transaction) => transaction.belopp === totalSum,
  );
  if (matchingTransaction) {
    return txs.filter((i) => i.id !== matchingTransaction.id);
  }
  return [];
};

const groupTransactionsByDate = (txs: TxBankAccount[]) => {
  return txs.reduce(
    (acc, tx) => {
      const date = tx.datum.toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(tx);
      return acc;
    },
    {} as Record<string, TxBankAccount[]>,
  );
};

export const markInternal = async (txs: TxBankAccount[]) => {
  const internal: string[] = [];
  const txsByDate = groupTransactionsByDate(txs);
  const dates = Object.keys(txsByDate);
  for (const date of dates) {
    const day = txsByDate[date];
    if (day) {
      if (hasDuplicates(day)) {
        const foundInternal = findInternal(day);
        for (const tx of foundInternal) {
          internal.push(tx);
        }
      }
    }
  }
  return txs.map((tx) => ({
    ...tx,
    budgetgrupp: internal.some((i) => i === tx.id) ? "inom" : tx.budgetgrupp,
  }));
};

export const hasDuplicates = <T extends { belopp: number }>(day: T[]) =>
  new Set(day.map((i) => Math.abs(i.belopp))).size !== day.length;
