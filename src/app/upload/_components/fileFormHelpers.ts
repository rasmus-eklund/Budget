import { encryptWithAES, getErrorMessage, parseTxs } from "~/lib";
import type { TxBankAccount } from "~/lib/zodSchemas";
import type { PersonAccounts, FileData, Tx } from "~/types";
import { getMergeBaseTransactions, upload } from "../actions/uploadActions";
import type { InsertTx } from "~/server/db/schema";
import ImportErrors from "./ImportErrors";
import type { ReactNode } from "react";
import { getUploadYear, getUploadedAccountIds } from "./uploadProcessing";
export {
  getUploadYear,
  getUploadedAccountIds,
  prepareFullReplaceTxs,
  prepareMergeTxs,
} from "./uploadProcessing";

export type UploadMode = "replaceYear" | "mergeAccounts";

export const getFileNames = (files: FileList | undefined) => {
  if (!files) {
    return [];
  }
  const names: string[] = [];
  for (const file of files) {
    names.push(file.name);
  }
  return names;
};

export const hasCorrectFilenames = (
  fileList: FileList,
): { success: boolean; name: string } => {
  const pattern = /.+_.+\.csv/;
  for (const file of fileList) {
    const filename = file.name;
    if (!pattern.test(filename)) {
      return { success: false, name: filename };
    }
  }
  return { success: true, name: "" };
};

export const readFiles = async (
  files: FileData[],
): Promise<
  { ok: true; data: TxBankAccount[] } | { ok: false; error: ReactNode }
> => {
  const allTxs: TxBankAccount[] = [];
  for (const { file, bankAccountId, config } of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    try {
      const res = await parseTxs({ buffer, bankAccountId, config });
      if (!res.ok) {
        const jsx = ImportErrors({
          error: res.error,
          file: file.name,
          skip: config.skipLines,
        });
        return { ok: false, error: jsx };
      }
      allTxs.push(...res.data);
    } catch (err) {
      const message = getErrorMessage(err);
      return { ok: false, error: `fil: ${file.name}, fel: ${message}` };
    }
  }
  return { ok: true, data: allTxs };
};

export const getMergeBaseTxs = async ({
  password,
  uploadedTxs,
  userId,
}: {
  password: string;
  uploadedTxs: TxBankAccount[];
  userId: string;
}) => {
  const year = getUploadYear(uploadedTxs);
  const accountIds = getUploadedAccountIds(uploadedTxs);
  return await getMergeBaseTransactions({
    excludedAccountIds: accountIds,
    password,
    userId,
    year,
  });
};

export const uploadFiles = async ({
  mode = "replaceYear",
  password,
  replacedAccountIds = [],
  txs,
  userId,
}: {
  mode?: UploadMode;
  password: string;
  replacedAccountIds?: string[];
  txs: TxBankAccount[];
  userId: string;
}) => {
  const year = getUploadYear(txs);
  const transactions: InsertTx[] = [];
  for (const { datum, id, bankAccountId, ...rest } of txs) {
    const encrypted = await encryptWithAES(JSON.stringify(rest), password);

    transactions.push({
      bankAccountId,
      year,
      date: datum,
      data: encrypted.toString(),
      id,
    });
  }
  await upload({ mode, replacedAccountIds, transactions, year, userId });
};

export const addPersonAccount = (
  people: PersonAccounts,
  txs: TxBankAccount[],
): Tx[] => {
  const accounts: Record<string, { person: string; konto: string }> = {};
  for (const person of people) {
    for (const account of person.bankAccounts) {
      accounts[account.id] = { person: person.name, konto: account.name };
    }
  }
  const out: Tx[] = [];
  for (const { bankAccountId, ...tx } of txs) {
    const personKonto = accounts[bankAccountId];
    if (!personKonto) {
      throw new Error("Något gick fel");
    }
    out.push({ ...tx, ...personKonto });
  }
  return out;
};

export const findMatchingAccount = (
  filename: string,
  items: {
    person: string;
    account: string;
    bankAccountId: string;
  }[],
) => {
  const fname = filename.toLowerCase();
  for (const item of items) {
    const person = item.person.toLowerCase();
    const account = item.account.toLowerCase();

    if (
      (fname.includes(person) && fname.includes(account)) ||
      (fname.includes(account) && fname.includes(person))
    ) {
      return item.bankAccountId;
    }
  }

  return "";
};
