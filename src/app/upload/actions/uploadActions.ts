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

export const upload = async ({
  transactions,
  year,
  userId,
}: {
  transactions: InsertTx[];
  year: number;
  userId: string;
}) => {
  const accounts = await db.query.persons.findMany({
    columns: {},
    with: { bankAccounts: { columns: { id: true } } },
    where: eq(persons.userId, userId),
  });
  const accountIds = accounts.flatMap((a) => a.bankAccounts.map((b) => b.id));
  if (accountIds.length !== 0) {
    await db
      .delete(txs)
      .where(
        and(eq(txs.year, Number(year)), inArray(txs.bankAccountId, accountIds)),
      );
  }
  await db.insert(txs).values(transactions);
  revalidatePath("/upload");
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
