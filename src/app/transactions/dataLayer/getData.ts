"use server";
import { and, eq, gte, lte } from "drizzle-orm";
import { applyCategories } from "~/lib/utils/categorize";
import { decryptWithAES } from "~/lib/utils/encryption";
import getErrorMessage from "~/lib/utils/handleError";
import { dbTxSchema, type FromTo, type Tx } from "~/lib/zodSchemas";
import { db } from "~/server/db";
import { category, txs } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import type { DbTx, TxReturn } from "~/types";

const decryptTxs = async (
  encryptedData: DbTx[],
  password: string,
): Promise<Tx[]> => {
  const decryptedData: Tx[] = [];
  for (const { id, data, date } of encryptedData) {
    const arr = new Uint8Array(data.split(",").map(Number));
    const decrypted = await decryptWithAES(arr, password);
    const parsed = dbTxSchema.safeParse(JSON.parse(decrypted));
    if (!parsed.success) {
      throw new Error("Korrupt data, ladda upp året igen.");
    }
    decryptedData.push({ datum: date, id, ...parsed.data });
  }
  return decryptedData;
};

const getTxByDates = async ({
  dates: { from, to },
  password,
}: {
  dates: FromTo;
  password: string;
}): Promise<TxReturn> => {
  const userId = await getUserId();
  const categories = await db.query.category.findMany({
    columns: { name: true },
    where: eq(category.userId, userId),
    with: { match: { columns: { name: true } } },
  });
  const encryptedData = await db
    .select()
    .from(txs)
    .where(
      and(
        eq(txs.userId, userId),
        gte(txs.date, new Date(from)),
        lte(txs.date, new Date(to)),
      ),
    );
  try {
    const decryptedData = await decryptTxs(encryptedData, password);
    const data = decryptedData.map((tx) => applyCategories({ tx, categories }));
    return { success: true, data, message: "Success" };
  } catch (error) {
    const message = getErrorMessage(error);
    if (message === "The operation failed for an operation-specific reason") {
      return { success: false, data: [], message: "Fel lösenord" };
    }
    return { success: false, data: [], message: "Något gick fel" };
  }
};

export default getTxByDates;
