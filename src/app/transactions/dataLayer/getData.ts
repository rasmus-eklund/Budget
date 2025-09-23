"use server";
import { and, eq, gte, lte } from "drizzle-orm";
import { redirect } from "next/navigation";
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
  userId,
}: {
  dates: FromTo;
  password: string;
  userId: string;
}): Promise<TxReturn> => {
  if (!userId) return { ok: false };
  if (password === "") redirect("/password?from=transactions");
  const categoriesReq = db.query.category.findMany({
    columns: { name: true },
    where: eq(category.userId, userId),
    with: { match: { columns: { name: true } } },
  });
  const personsReq = db.query.persons.findMany({
    where: eq(persons.userId, userId),
    with: {
      bankAccounts: {
        with: {
          txs: { where: and(gte(txs.date, from), lte(txs.date, to)) },
        },
      },
    },
  });

  const [categories, personsRes] = await Promise.all([
    categoriesReq,
    personsReq,
  ]);

  const out: TxReturn = { ok: true, data: [] };
  for (const person of personsRes) {
    for (const account of person.bankAccounts) {
      for (const { data, date, id } of account.txs) {
        try {
          const decrypted = await decryptTxs(data, password);
          out.data.push(
            applyCategory({
              tx: {
                ...decrypted,
                datum: date,
                person: person.name,
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
            redirect("/password?from=transactions&error=true");
          }
          return { ok: false };
        }
      }
    }
  }
  return out;
};

export default getTxByDates;
