"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { and, eq, sql } from "drizzle-orm";
import { txs } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import type { DbTx } from "~/types";
import { randomUUID } from "crypto";

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
  await db
    .insert(txs)
    .values(transactions.map((i) => ({ ...i, id: randomUUID(), userId })));
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
