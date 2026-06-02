import type { Filter, FilterItem, TxSort } from "~/types";
import { emptySearchFilter, sortOptions } from "~/constants";

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
  const search = textFilter(text, filter.search);
  return search && personMatch && categoryMatch && accountMatch;
};

const textFilter = (text: string, search: Filter["search"]) => {
  if (search.terms.length === 0) {
    return true;
  }

  const normalizedText = text.toLowerCase();
  const hasMatch = search.terms.some((term) =>
    normalizedText.includes(term.toLowerCase()),
  );

  return search.mode === "include" ? hasMatch : !hasMatch;
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

export const applyTransactionFilters = <T extends TransactionSort & Part>({
  data,
  filters: { filter, txSort },
}: {
  data: T[];
  filters: { filter: Filter; txSort: TxSort };
}) =>
  data
    .filter((d) => transactionFilter({ ...d, filter }))
    .sort((a, b) => transactionSort(a, b, txSort));

const compare = (a: FilterItem, b: FilterItem) => {
  return Object.keys(a).every((key) => a[key] === b[key]);
};

const compareSearch = (a: Filter["search"], b: Filter["search"]) =>
  a.mode === b.mode &&
  a.terms.length === b.terms.length &&
  a.terms.every((term, index) => term === b.terms[index]);

export const filterChanged = ({
  defaultFilter,
  filter,
}: {
  defaultFilter: Filter;
  filter: Filter;
}) => {
  return (
    !compare(defaultFilter.account, filter.account) ||
    !compare(defaultFilter.category, filter.category) ||
    !compare(defaultFilter.person, filter.person) ||
    !compareSearch(defaultFilter.search, filter.search)
  );
};

export const resetFilter = (filter: Filter): Filter => ({
  category: allTrueExcept(filter.category, "inom"),
  person: setAll(filter.person, true),
  account: setAll(filter.account, true),
  search: emptySearchFilter,
});

export const allTrueExcept = (filter: FilterItem, key: string): FilterItem =>
  Object.fromEntries(Object.keys(filter).map((k) => [k, key !== k]));

export const allFalseExcept = (filter: FilterItem, key: string): FilterItem =>
  Object.fromEntries(Object.keys(filter).map((k) => [k, key === k]));

export const setAll = (filter: FilterItem, value: boolean): FilterItem =>
  Object.fromEntries(Object.keys(filter).map((k) => [k, value]));
