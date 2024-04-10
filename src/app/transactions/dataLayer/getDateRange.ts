import { eq, max, min } from "drizzle-orm";
import { db } from "~/server/db";
import { txs } from "~/server/db/schema";
import getUserId from "~/server/getUserId";

export const getDateRange = async () => {
  const userId = await getUserId();
  const range = await db
    .select({ from: min(txs.date), to: max(txs.date) })
    .from(txs)
    .where(eq(txs.userId, userId));
  if (range[0]) {
    return range[0];
  }
  return { from: null, to: null };
};
