"use server";

import { eq } from "drizzle-orm";
import { encryptWithAES } from "~/lib";
import { db } from "~/server/db";
import { txs } from "~/server/db/schema";
import type { Tx } from "~/types";

export const updateTransaction = async ({
  tx,
  internal,
  password,
}: {
  tx: Tx;
  internal: boolean;
  password: string;
}) => {
  if (!password) {
    throw new Error("Password missing.");
  }
  const encrypted = await encryptWithAES(
    JSON.stringify({
      text: tx.text,
      budgetgrupp: internal ? "inom" : "övrigt",
      belopp: tx.belopp,
      saldo: tx.saldo,
    }),
    password,
  );

  const res = await db
    .update(txs)
    .set({ data: encrypted.toString() })
    .where(eq(txs.id, tx.id))
    .returning({ id: txs.id });
  if (res.length === 0)
    return { ok: false, error: "Kunde inte uppdatera transaktionen" };
  return { ok: true };
};
