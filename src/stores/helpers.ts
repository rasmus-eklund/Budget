import type { Filter, FilterItem } from "~/types";

const compare = (a: FilterItem, b: FilterItem) => {
  return Object.keys(a).every((key) => a[key] === b[key]);
};

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
    defaultFilter.search !== filter.search
  );
};

export const resetFilter = (filter: Filter): Filter => ({
  category: allTrueExcept(filter.category, "inom"),
  person: setAll(filter.person, true),
  account: setAll(filter.account, true),
  search: "",
});

export const allTrueExcept = (filter: FilterItem, key: string): FilterItem =>
  Object.fromEntries(Object.keys(filter).map((k) => [k, key !== k]));

export const allFalseExcept = (filter: FilterItem, key: string): FilterItem =>
  Object.fromEntries(Object.keys(filter).map((k) => [k, key === k]));

export const setAll = (filter: FilterItem, value: boolean): FilterItem =>
  Object.fromEntries(Object.keys(filter).map((k) => [k, value]));
