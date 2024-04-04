import type { TxFilter, TxSort } from "~/types";

type TransactionFilter = {
  person: string;
  budgetgrupp: string;
  konto: string;
  filter: TxFilter;
};

type TransactionSort = { datum: Date; belopp: number };
export const transactionFilter = <T extends TransactionFilter>({
  konto,
  person,
  budgetgrupp,
  filter,
}: T) => {
  const personMatch = filter.person === "" || person === filter.person;
  const categoryMatch =
    filter.category === "" || budgetgrupp === filter.category;
  const accountMatch = filter.account === "" || konto === filter.account;
  const inomMatch = filter.inom || budgetgrupp !== "inom";
  return personMatch && categoryMatch && accountMatch && inomMatch;
};

export const transactionSort = <T extends TransactionSort>(
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

const applyTransactionFilters = <
  T extends TransactionFilter & TransactionSort,
>({
  data,
  filters: { txFilter, txSort },
}: {
  data: T[];
  filters: { txFilter: TxFilter; txSort: TxSort };
}) =>
  data
    .filter((d) => transactionFilter({ ...d, filter: txFilter }))
    .sort((a, b) => transactionSort(a, b, txSort));

export default applyTransactionFilters;
