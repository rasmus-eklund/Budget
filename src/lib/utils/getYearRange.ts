import { type FromTo } from "../zodSchemas";

export const getYearRange = ({ from, to }: FromTo) => {
  const start = from.getFullYear();
  const end = to.getFullYear();
  const range: number[] = [];
  for (let year = start; year <= end; year++) {
    range.push(year);
  }
  return range;
};

export const getFromTo = <T extends { datum: Date }>(
  txs: T[],
): { from: Date; to: Date } => {
  if (!txs[0]) {
    throw new Error("No transactions");
  }
  let from = txs[0].datum;
  let to = txs[0].datum;

  for (const { datum } of txs) {
    if (datum < from) {
      from = datum;
    }
    if (datum > to) {
      to = datum;
    }
  }

  return { from, to };
};
