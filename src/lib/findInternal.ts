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
    } else {
      const heuristicIds = findInternalPairsByHeuristics(group);
      for (const id of heuristicIds) {
        internalIds.add(id);
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

const findInternalPairsByHeuristics = (group: Internal[]) => {
  const negatives = group.filter((tx) => tx.belopp < 0);
  const positives = group.filter((tx) => tx.belopp > 0);
  if (negatives.length === 0 || positives.length === 0) {
    return [];
  }

  const posHasNegativeSameAccount = new Set<string>();
  const negAccounts = new Set(negatives.map((tx) => tx.bankAccountId));
  for (const tx of positives) {
    if (negAccounts.has(tx.bankAccountId)) {
      posHasNegativeSameAccount.add(tx.bankAccountId);
    }
  }

  const positiveCountByAccount = new Map<string, number>();
  for (const tx of positives) {
    positiveCountByAccount.set(
      tx.bankAccountId,
      (positiveCountByAccount.get(tx.bankAccountId) ?? 0) + 1,
    );
  }

  const edges: { negIdx: number; posIdx: number; score: number }[] = [];
  for (let negIdx = 0; negIdx < negatives.length; negIdx++) {
    for (let posIdx = 0; posIdx < positives.length; posIdx++) {
      const negative = negatives[negIdx];
      if (!negative) continue;
      const positive = positives[posIdx];
      if (!positive) continue;
      if (negative.bankAccountId === positive.bankAccountId) {
        continue;
      }
      let score = 0;
      if (
        typeof negative.person === "string" &&
        typeof positive.person === "string" &&
        negative.person.toLowerCase() === positive.person.toLowerCase()
      ) {
        score += 20;
      }
      if (!posHasNegativeSameAccount.has(positive.bankAccountId)) {
        score += 5;
      }
      if ((positiveCountByAccount.get(positive.bankAccountId) ?? 0) === 1) {
        score += 2;
      }
      edges.push({ negIdx, posIdx, score });
    }
  }
  edges.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.negIdx !== b.negIdx) return a.negIdx - b.negIdx;
    return a.posIdx - b.posIdx;
  });

  const usedNeg = new Set<number>();
  const usedPos = new Set<number>();
  const ids: string[] = [];
  for (const edge of edges) {
    if (usedNeg.has(edge.negIdx) || usedPos.has(edge.posIdx)) {
      continue;
    }
    usedNeg.add(edge.negIdx);
    usedPos.add(edge.posIdx);
    ids.push(negatives[edge.negIdx]!.id, positives[edge.posIdx]!.id);
  }

  return ids;
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

export const markInternal = (txs: TxBankAccount[]) => {
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
