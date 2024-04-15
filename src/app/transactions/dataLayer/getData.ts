"use server";
import { and, eq, gte, lte } from "drizzle-orm";
import { notFound } from "next/navigation";
import { applyCategory } from "~/lib/utils/categorize";
import { decryptWithAES } from "~/lib/utils/encryption";
import getErrorMessage from "~/lib/utils/handleError";
import {
  type EncryptedDataSchema,
  encryptedDataSchema,
  type FromTo,
} from "~/lib/zodSchemas";
import { db } from "~/server/db";
import { category, persons, txs } from "~/server/db/schema";
import getUserId from "~/server/getUserId";
import type { TxReturn } from "~/types";

const decryptTxs = async (
  data: string,
  password: string,
): Promise<EncryptedDataSchema> => {
  const arr = new Uint8Array(data.split(",").map(Number));
  const decrypted = await decryptWithAES(arr, password);
  const parsed = encryptedDataSchema.safeParse(JSON.parse(decrypted));
  if (!parsed.success) {
    throw new Error("Korrupt data, ladda upp året igen.");
  }
  return parsed.data;
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
  const response = await db.query.persons.findFirst({
    where: eq(persons.userId, userId),
    with: {
      bankAccounts: {
        with: {
          txs: { where: and(gte(txs.date, from), lte(txs.date, to)) },
        },
      },
    },
  });
  if (!response) {
    notFound();
  }
  const out: TxReturn = { data: [], status: "Success" };
  for (const account of response.bankAccounts) {
    for (const { data, date, id } of account.txs) {
      try {
        const decrypted = await decryptTxs(data, password);
        out.data.push(
          applyCategory({
            tx: {
              ...decrypted,
              datum: date,
              person: response.name,
              konto: account.name,
              id,
            },
            categories,
          }),
        );
      } catch (error) {
        const message = getErrorMessage(error);
        if (
          message === "The operation failed for an operation-specific reason"
        ) {
          return { data: [], status: "Wrong password" };
        }
        return { data: [], status: "Error" };
      }
    }
  }

  return out;
};

export default getTxByDates;
