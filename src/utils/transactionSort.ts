import type { TxSort } from "~/types";

const transactionSort = <T extends { datum: Date; belopp: number }>(
  a: T,
  b: T,
  sortFilter: TxSort,
) => {
  if (sortFilter.belopp === "Datum (Lågt-Högt)") {
    return Number(a.datum) - Number(b.datum);
  }
  if (sortFilter.belopp === "Datum (Högt-Lågt)") {
    return Number(b.datum) - Number(a.datum);
  }
  if (sortFilter.belopp === "Belopp (Lågt-Högt)") {
    return a.belopp - b.belopp;
  }
  return b.belopp - a.belopp;
};

export default transactionSort;
