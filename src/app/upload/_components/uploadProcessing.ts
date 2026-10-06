import { Temporal } from "@js-temporal/polyfill";
import { markInternal } from "~/lib";
import type { TxBankAccount } from "~/lib/zodSchemas";

export const getUploadYear = (txs: TxBankAccount[]) => {
  const years = new Set(
    txs.map(({ datum }) =>
      datum instanceof Temporal.PlainDate ? datum.year : (datum as Temporal.PlainDate).year,
    ),
  );
  if (years.size !== 1) {
    throw new Error("Ett år per uppladdning");
  }
  const [year] = Array.from(years) as [number];
  return year;
};

export const getUploadedAccountIds = (txs: TxBankAccount[]) =>
  Array.from(new Set(txs.map(({ bankAccountId }) => bankAccountId)));

const sortForInternalMarking = (txs: TxBankAccount[]) =>
  [...txs].sort((a, b) => {
    const dateDiff =
      a.datum instanceof Temporal.PlainDate && b.datum instanceof Temporal.PlainDate
        ? Temporal.PlainDate.compare(a.datum, b.datum)
        : String(a.datum).localeCompare(String(b.datum));
    if (dateDiff !== 0) {
      return dateDiff;
    }
    const accountDiff = a.bankAccountId.localeCompare(b.bankAccountId);
    if (accountDiff !== 0) {
      return accountDiff;
    }
    const sourceOrderDiff = a.sourceOrder - b.sourceOrder;
    if (sourceOrderDiff !== 0) {
      return sourceOrderDiff;
    }
    return a.id.localeCompare(b.id);
  });

export const prepareFullReplaceTxs = (txs: TxBankAccount[]) => {
  const start = performance.now();
  const data = markInternal(sortForInternalMarking(txs));
  const end = performance.now();
  console.warn(`Processed ${data.length} txs in ${end - start} ms`);
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
    sortForInternalMarking(
      [...existingTxs, ...uploadedTxs].map((tx) => ({
        ...tx,
        budgetgrupp: "övrigt",
      })),
    ),
  );
  const end = performance.now();
  console.warn(`Processed ${data.length} txs in ${end - start} ms`);
  return data;
};
