"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { and, eq, sql } from "drizzle-orm";
import { category, txs } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import type { DbTx } from "~/types";

export const upload = async ({
  transactions,
  year,
}: {
  transactions: DbTx[];
  year: number;
}) => {
  const userId = await getUserId();
  await db
    .delete(txs)
    .where(and(eq(txs.year, Number(year)), eq(txs.userId, userId)));
  await db.insert(txs).values(transactions.map((i) => ({ ...i, userId })));
  revalidatePath("/upload");
};

export const getTxsPerYear = async () => {
  const userId = await getUserId();
  const data = await db
    .select({
      year: txs.year,
      count: sql<number>`cast(count(${txs.id}) as int)`,
    })
    .from(txs)
    .where(eq(txs.userId, userId))
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
