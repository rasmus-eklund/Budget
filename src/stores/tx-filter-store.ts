import { create } from "zustand";
import type { Tab, TxFilter, TxSort } from "~/types";

const emptyTxFilter: TxFilter = {
  category: [],
  person: [],
  account: [],
  search: "",
};

const sameItems = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((item) => b.includes(item));
};
const isChanged = (a: TxFilter, b: TxFilter) =>
  !sameItems(a.account, b.account) ||
  !sameItems(a.category, b.category) ||
  !sameItems(a.person, b.person) ||
  a.search !== b.search;

export const useTxFilterStore = create<{
  txFilter: TxFilter;
  defaultTxFilter: TxFilter;
  txSort: TxSort;
  tab: Tab;
  hasChanged: boolean;
  setTxFilter: (txFilter: TxFilter) => void;
  setDefaultTxFilter: (txFilter: TxFilter) => void;
  setTxSort: (sortOption: TxSort) => void;
  setTab: (tab: Tab) => void;
  reset: () => void;
}>((set) => ({
  txFilter: emptyTxFilter,
  defaultTxFilter: emptyTxFilter,
  txSort: { sort: "date-asc" },
  tab: "aggregated",
  hasChanged: false,
  setTxFilter: (txFilter: TxFilter) => {
    set(({ defaultTxFilter }) => ({
      hasChanged: isChanged(txFilter, defaultTxFilter),
    }));
    set({ txFilter });
  },
  setDefaultTxFilter: (txFilter: TxFilter) => {
    set({ hasChanged: false });
    set({ defaultTxFilter: txFilter });
  },
  setTxSort: (txSort: TxSort) => {
    if (txSort.sort !== "date-asc") {
      set({ hasChanged: true });
    }
    set({ txSort });
  },
  setTab: (tab: Tab) => set({ tab }),
  reset: () => {
    set({ hasChanged: false });
    set(({ defaultTxFilter }) => ({
      txFilter: defaultTxFilter,
      txSort: { sort: "date-asc" },
    }));
  },
}));
