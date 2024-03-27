import { and, gte, lte } from "drizzle-orm";
import type { FromTo } from "~/lib/zodSchemas";
import { db } from "~/server/db";
import { txs } from "~/server/db/schema";

const getTxByDates = async ({ from, to }: FromTo) => {
  const encryptedData = await db
    .select()
    .from(txs)
    .where(and(gte(txs.date, new Date(from)), lte(txs.date, new Date(to))));
  return encryptedData;
};

export default getTxByDates;
