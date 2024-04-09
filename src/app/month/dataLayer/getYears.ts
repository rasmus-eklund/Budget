import { desc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { txs } from "~/server/db/schema";
import getUserId from "~/server/getUserId";

export const getYears = async () => {
  const userId = await getUserId();
  const years = await db
    .selectDistinctOn([txs.year], { years: txs.year })
    .from(txs)
    .where(eq(txs.userId, userId))
    .orderBy(desc(txs.year));
  return years.map((i) => i.years);
};
