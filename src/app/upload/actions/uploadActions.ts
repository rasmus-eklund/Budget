"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { and, inArray, eq, sql } from "drizzle-orm";
import {
  type InsertTx,
  category,
  persons,
  txs,
  bankAccounts,
} from "~/server/db/schema";
import { decryptTxData } from "~/lib";
import type { TxBankAccount } from "~/lib/zodSchemas";

export const upload = async ({
  transactions,
  year,
  userId,
  mode = "replaceYear",
  replacedAccountIds = [],
}: {
  transactions: InsertTx[];
  year: number;
  userId: string;
  mode?: "replaceYear" | "mergeAccounts";
  replacedAccountIds?: string[];
}) => {
  const accounts = await db.query.persons.findMany({
    columns: {},
    with: { bankAccounts: { columns: { id: true } } },
    where: eq(persons.userId, userId),
  });
  const accountIds = accounts.flatMap((a) => a.bankAccounts.map((b) => b.id));

  if (mode === "replaceYear") {
    if (accountIds.length !== 0) {
      await db
        .delete(txs)
        .where(
          and(
            eq(txs.year, Number(year)),
            inArray(txs.bankAccountId, accountIds),
          ),
        );
    }
    await db.insert(txs).values(transactions);
    revalidatePath("/upload");
    return;
  }

  const ownedAccountIds = new Set(accountIds);
  const replaceIds = Array.from(new Set(replacedAccountIds));
  if (replaceIds.length === 0) {
    throw new Error("Minst ett konto måste valjas for sammanslagning.");
  }
  if (replaceIds.some((id) => !ownedAccountIds.has(id))) {
    throw new Error("Kunde inte uppdatera valt konto.");
  }

  const replaceIdSet = new Set(replaceIds);
  const newTransactions = transactions.filter((transaction) =>
    replaceIdSet.has(transaction.bankAccountId),
  );
  const keptTransactions = transactions.filter(
    (transaction) => !replaceIdSet.has(transaction.bankAccountId),
  );

  await db.transaction(async (tx) => {
    await tx
      .delete(txs)
      .where(
        and(eq(txs.year, Number(year)), inArray(txs.bankAccountId, replaceIds)),
      );

    if (newTransactions.length !== 0) {
      await tx.insert(txs).values(newTransactions);
    }

    for (const transaction of keptTransactions) {
      await tx
        .update(txs)
        .set({ data: transaction.data })
        .where(
          and(
            eq(txs.id, transaction.id),
            eq(txs.year, Number(year)),
            inArray(txs.bankAccountId, accountIds),
          ),
        );
    }
  });

  revalidatePath("/upload");
};

export const getMergeBaseTransactions = async ({
  userId,
  year,
  excludedAccountIds,
  password,
}: {
  userId: string;
  year: number;
  excludedAccountIds: string[];
  password: string;
}): Promise<TxBankAccount[]> => {
  const excluded = new Set(excludedAccountIds);
  const data = await db.query.persons.findMany({
    columns: {},
    where: eq(persons.userId, userId),
    with: {
      bankAccounts: {
        columns: { id: true },
        with: {
          txs: {
            columns: { id: true, date: true, data: true, bankAccountId: true },
            where: eq(txs.year, year),
          },
        },
      },
    },
  });

  const out: TxBankAccount[] = [];
  for (const person of data) {
    for (const account of person.bankAccounts) {
      if (excluded.has(account.id)) continue;
      for (const tx of account.txs) {
        const decrypted = await decryptTxData(tx.data, password);
        out.push({
          ...decrypted,
          datum: tx.date,
          bankAccountId: tx.bankAccountId,
          id: tx.id,
        });
      }
    }
  }

  return out;
};

export const getTxsPerYear = async (userId: string) => {
  const data = await db
    .select({
      year: txs.year,
      count: sql<number>`cast(count(${txs.id}) as int)`,
    })
    .from(persons)
    .where(eq(persons.userId, userId))
    .innerJoin(bankAccounts, eq(bankAccounts.personId, persons.id))
    .innerJoin(txs, eq(txs.bankAccountId, bankAccounts.id))
    .groupBy(txs.year)
    .orderBy(txs.year);
  return data;
};

export const GetCategories = async (userId: string) => {
  const categories = await db.query.category.findMany({
    columns: { name: true },
    where: eq(category.userId, userId),
    with: { match: { columns: { name: true } } },
  });
  return categories;
};

export const getPersonAccounts = async (userId: string) => {
  return await db.query.persons.findMany({
    columns: { id: true, name: true },
    where: eq(persons.userId, userId),
    with: { bankAccounts: { columns: { name: true, id: true } } },
  });
};
