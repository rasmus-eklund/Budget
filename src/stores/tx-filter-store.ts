import { create } from "zustand";
import type { Tab, TxFilter, TxSort } from "~/types";

const defaultTxFilter: TxFilter = {
  category: "none",
  person: "none",
  account: "none",
  inom: false,
  search: "",
};

const isChanged = (a: TxFilter, b: TxFilter) => {
  console.log(a, b);
  return (
    a.category !== b.category ||
    a.person !== b.person ||
    a.account !== b.account ||
    a.inom !== b.inom ||
    a.search !== b.search
  );
};

export const useTxFilterStore = create<{
  txFilter: TxFilter;
  txSort: TxSort;
  tab: Tab;
  hasChanged: boolean;
  setTxFilter: (txFilter: TxFilter) => void;
  setTxSort: (sortOption: TxSort) => void;
  setTab: (tab: Tab) => void;
  reset: () => void;
}>((set) => ({
  txFilter: defaultTxFilter,
  txSort: { sort: "date-asc" },
  tab: "aggregated",
  hasChanged: false,
  setTxFilter: (txFilter: TxFilter) => {
    set({ hasChanged: isChanged(txFilter, defaultTxFilter) });
    set({ txFilter });
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
    set({ txFilter: defaultTxFilter, txSort: { sort: "date-asc" } });
  },
}));
