import { encryptWithAES } from "~/lib/utils/encryption";
import { markInternal } from "~/lib/utils/findInternal";
import parseTxs from "~/lib/utils/parseTxs";
import type { Tx, TxBankAccount } from "~/lib/zodSchemas";
import type { PersonAccounts, FileData } from "~/types";
import { upload } from "../actions/uploadActions";
import type { InsertTx } from "~/server/db/schema";

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
  updatePercent: (percent: number) => void,
) => {
  const data: TxBankAccount[] = [];
  for (const { file, bankAccountId } of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const txs = await parseTxs(buffer, bankAccountId);
    data.push(...txs);
  }
  const internal = await markInternal(data, updatePercent);

  return internal;
};

export const uploadFiles = async ({
  password,
  txs,
}: {
  password: string;
  txs: TxBankAccount[];
}) => {
  const years = new Set<number>();
  const transactions: InsertTx[] = [];
  for (const { datum, id, bankAccountId, ...rest } of txs) {
    const encrypted = await encryptWithAES(JSON.stringify(rest), password);
    const year = datum.getFullYear();

    transactions.push({
      bankAccountId,
      year,
      date: datum,
      data: encrypted.toString(),
      id,
    });
    years.add(year);
  }
  if (years.size !== 1) {
    throw new Error("Ett år per uppladdning");
  }
  const [year] = Array.from(years) as [number];
  await upload({ transactions, year });
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
