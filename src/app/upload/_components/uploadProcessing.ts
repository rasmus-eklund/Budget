import { markInternal } from "~/lib";
import type { TxBankAccount } from "~/lib/zodSchemas";

export const getUploadYear = (txs: TxBankAccount[]) => {
  const years = new Set(txs.map(({ datum }) => datum.getFullYear()));
  if (years.size !== 1) {
    throw new Error("Ett år per uppladdning");
  }
  const [year] = Array.from(years) as [number];
  return year;
};

export const getUploadedAccountIds = (txs: TxBankAccount[]) =>
  Array.from(new Set(txs.map(({ bankAccountId }) => bankAccountId)));

export const prepareFullReplaceTxs = (txs: TxBankAccount[]) => {
  const start = performance.now();
  const data = markInternal(txs);
  const end = performance.now();
  console.log(`Processed ${data.length} txs in ${end - start} ms`);
  return data;
};

export const prepareMergeTxs = ({
  existingTxs,
  uploadedTxs,
}: {
  existingTxs: TxBankAccount[];
  uploadedTxs: TxBankAccount[];
}) => {
  const start = performance.now();
  const data = markInternal(
    [...existingTxs, ...uploadedTxs].map((tx) => ({
      ...tx,
      budgetgrupp: "övrigt",
    })),
  );
  const end = performance.now();
  console.log(`Processed ${data.length} txs in ${end - start} ms`);
  return data;
};
