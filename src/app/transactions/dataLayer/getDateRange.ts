import { eq, max, min } from "drizzle-orm";
import { db } from "~/server/db";
import { bankAccounts, persons, txs } from "~/server/db/schema";

export const getDateRange = async (userId: string) => {
  const range = await db
    .select({ from: min(txs.date), to: max(txs.date) })
    .from(persons)
    .innerJoin(bankAccounts, eq(bankAccounts.personId, persons.id))
    .innerJoin(txs, eq(txs.bankAccountId, bankAccounts.id))
    .where(eq(persons.userId, userId));
  if (!range[0]) {
    return false;
  }
  const { from, to } = range[0];
  if (!from || !to) {
    return false;
  }
  return { from, to };
};
