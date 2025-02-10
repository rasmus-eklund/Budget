import type { TxFilter, TxSort } from "~/types";
import { sortOptions } from "~/lib/constants/sortOptions";

export type Part = {
  person: string;
  budgetgrupp: string;
  konto: string;
  text: string;
};

type TransactionSort = { datum: Date; belopp: number };

export const getDefaultFilter = () => {
  const defaults: { txFilter: TxFilter; txSort: TxSort } = {
    txFilter: {
      category: "none",
      person: "none",
      account: "none",
      inom: false,
      search: "",
    },
    txSort: { sort: sortOptions.dateAsc },
  };
  return defaults;
};

export const transactionFilter = <T extends Part & { filter: TxFilter }>({
  konto,
  person,
  budgetgrupp,
  text,
  filter,
}: T) => {
  const personMatch = filter.person === "none" || person === filter.person;
  const categoryMatch =
    filter.category === "none" || budgetgrupp === filter.category;
  const accountMatch = filter.account === "none" || konto === filter.account;
  const inomMatch = filter.inom || budgetgrupp !== "inom";
  const search =
    filter.search === "" ||
    text.toLowerCase().includes(filter.search.toLowerCase());
  return search && personMatch && categoryMatch && accountMatch && inomMatch;
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
  filters: { txFilter, txSort },
}: {
  data: T[];
  filters: { txFilter: TxFilter; txSort: TxSort };
}) =>
  data
    .filter((d) => transactionFilter({ ...d, filter: txFilter }))
    .sort((a, b) => transactionSort(a, b, txSort));

export default applyTransactionFilters;
