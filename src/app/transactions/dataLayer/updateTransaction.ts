"use server";

import { and, eq, inArray } from "drizzle-orm";
import { decryptTxData, encryptWithAES } from "~/lib";
import getUserId from "~/server/getUserId";
import { db } from "~/server/db";
import { bankAccounts, persons, txs } from "~/server/db/schema";
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
  const userId = await getUserId();
  if (!password) throw new Error("Password missing.");

  const ownedAccountIdsQuery = db
    .select({ id: bankAccounts.id })
    .from(bankAccounts)
    .innerJoin(persons, eq(persons.id, bankAccounts.personId))
    .where(eq(persons.userId, userId));

  const existing = await db.query.txs.findFirst({
    columns: { data: true },
    where: and(
      eq(txs.id, tx.id),
      inArray(txs.bankAccountId, ownedAccountIdsQuery),
    ),
  });

  if (!existing) {
    return { ok: false, error: "Kunde inte uppdatera transaktionen" };
  }

  let currentTxData: Awaited<ReturnType<typeof decryptTxData>>;
  try {
    currentTxData = await decryptTxData(existing.data, password);
  } catch {
    return { ok: false, error: "Kunde inte uppdatera transaktionen" };
  }

  const encrypted = await encryptWithAES(
    JSON.stringify({
      text: currentTxData.text,
      budgetgrupp: internal ? "inom" : "övrigt",
      belopp: currentTxData.belopp,
      saldo: currentTxData.saldo,
    }),
    password,
  );

  const res = await db
    .update(txs)
    .set({ data: encrypted.toString() })
    .where(
      and(
        eq(txs.id, tx.id),
        inArray(txs.bankAccountId, ownedAccountIdsQuery),
      ),
    )
    .returning({ id: txs.id });

  if (res.length === 0) {
    return { ok: false, error: "Kunde inte uppdatera transaktionen" };
  }

  return { ok: true };
};
