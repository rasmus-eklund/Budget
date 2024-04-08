import { encryptWithAES } from "~/lib/utils/encryption";
import { markInternal } from "~/lib/utils/findInternal";
import parseTxs from "~/lib/utils/parseTxs";
import { type Tx } from "~/lib/zodSchemas";
import { type DbTx } from "~/types";
import { upload } from "../actions/uploadActions";

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
  files: FileList,
  updatePercent: (percent: number) => void,
) => {
  const data: Tx[] = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const [person, konto_end] = file.name.split("_") as [string, string];
    const konto = konto_end.replace(".csv", "").replace("Ã¤", "ä");
    const txs = await parseTxs(buffer, person, konto);
    data.push(...txs);
  }
  const internal = markInternal(data, updatePercent);
  return internal;
};

export const uploadFiles = async ({
  password,
  txs,
}: {
  password: string;
  txs: Tx[];
}) => {
  const years = new Set<number>();
  const transactions: DbTx[] = [];
  for (const { datum, id, ...rest } of txs) {
    const encrypted = await encryptWithAES(JSON.stringify(rest), password);
    const year = datum.getFullYear();
    const tx = {
      year,
      date: datum,
      data: encrypted.toString(),
      id,
    };
    transactions.push(tx);
    years.add(year);
  }
  if (years.size !== 1) {
    throw new Error("Ett år per uppladdning");
  }
  const [year] = Array.from(years) as [number];
  await upload({ transactions, year });
};
