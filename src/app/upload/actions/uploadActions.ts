"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { and, inArray, eq, sql } from "drizzle-orm";
import {
  type InsertTx,
  category,
  persons,
  txs,
  users,
  bankAccounts,
} from "~/server/db/schema";
import getUserId from "~/server/getUserId";

export const upload = async ({
  transactions,
  year,
}: {
  transactions: InsertTx[];
  year: number;
}) => {
  const userId = await getUserId();
  const accounts = await db.query.bankAccounts.findMany({
    columns: { id: true },
    where: eq(bankAccounts.personId, userId),
  });
  const accountIds = accounts.map((a) => a.id);
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

export const getTxsPerYear = async () => {
  const userId = await getUserId();
  const data = await db
    .select({
      year: txs.year,
      count: sql<number>`cast(count(${txs.id}) as int)`,
    })
    .from(users)
    .where(eq(users.id, userId))
    .innerJoin(persons, eq(persons.userId, userId))
    .innerJoin(bankAccounts, eq(bankAccounts.personId, persons.id))
    .innerJoin(txs, eq(txs.bankAccountId, bankAccounts.id))
    .groupBy(txs.year)
    .orderBy(txs.year);
  return data;
};

export const GetCategories = async () => {
  const userId = await getUserId();
  const categories = await db.query.category.findMany({
    columns: { name: true },
    where: eq(category.userId, userId),
    with: { match: { columns: { name: true } } },
  });
  return categories;
};

export const getPersonAccounts = async () => {
  const userId = await getUserId();
  return await db.query.persons.findMany({
    columns: { id: true, name: true },
    where: eq(persons.userId, userId),
    with: { bankAccounts: { columns: { name: true, id: true } } },
  });
};
