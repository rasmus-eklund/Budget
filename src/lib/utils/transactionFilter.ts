import type { Filter, TxSort } from "~/types";
import { sortOptions } from "~/lib/constants/sortOptions";

export type Part = {
  person: string;
  budgetgrupp: string;
  konto: string;
  text: string;
};

type TransactionSort = { datum: Date; belopp: number };

export const transactionFilter = <T extends Part & { filter: Filter }>({
  konto,
  person,
  budgetgrupp,
  text,
  filter,
}: T) => {
  const personMatch = filter.person[person];
  const categoryMatch = filter.category[budgetgrupp];
  const accountMatch = filter.account[konto];
  const search =
    filter.search === "" ||
    text.toLowerCase().includes(filter.search.toLowerCase());
  return search && personMatch && categoryMatch && accountMatch;
};

export const transactionSort = <T extends TransactionSort>(
  a: T,
  b: T,
  sortFilter: TxSort,
) => {
  if (sortFilter.sort === sortOptions.dateAsc) {
    return Number(a.datum) - Number(b.datum);
  }
  if (sortFilter.sort === sortOptions.dateDesc) {
    return Number(b.datum) - Number(a.datum);
  }
  if (sortFilter.sort === sortOptions.amountAsc) {
    return a.belopp - b.belopp;
  }
  return b.belopp - a.belopp;
};

const applyTransactionFilters = <T extends TransactionSort & Part>({
  data,
  filters: { filter, txSort },
}: {
  data: T[];
  filters: { filter: Filter; txSort: TxSort };
}) =>
  data
    .filter((d) => transactionFilter({ ...d, filter }))
    .sort((a, b) => transactionSort(a, b, txSort));

export default applyTransactionFilters;
