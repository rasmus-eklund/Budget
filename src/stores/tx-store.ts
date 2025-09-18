import { create } from "zustand";
import type { FromTo } from "~/lib/zodSchemas";
import type { FilterTab, Tx, TxFilter, TxSort, DateTab } from "~/types";

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

const getDefaultTxFilter = (txs: Tx[]) => ({
  category: [...new Set(txs.map((i) => i.budgetgrupp))].filter(
    (i) => i !== "inom",
  ),
  person: [...new Set(txs.map((i) => i.person))],
  account: [...new Set(txs.map((i) => i.konto))],
  search: "",
});

export const useStore = create<{
  txs: Tx[];
  setTxs: (txs: Tx[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  password: string;
  updatePassword: (password: string) => void;
  dateTab: DateTab;
  setDateTab: (dateTab: DateTab) => void;
  dates: FromTo;
  txFilter: TxFilter;
  defaultTxFilter: TxFilter;
  txSort: TxSort;
  filterTab: FilterTab;
  hasChanged: boolean;
  setTxFilter: (txFilter: TxFilter) => void;
  setTxSort: (sortOption: TxSort) => void;
  setFilterTab: (tab: FilterTab) => void;
  reset: () => void;
  month: { year: number; month: number };
  setMonth: (month: { year: number; month: number }) => void;
  range: FromTo;
  setRange: (range: FromTo) => void;
}>((set) => ({
  txs: [],
  setTxs: (txs) => {
    const defaultTxFilter = getDefaultTxFilter(txs);
    set({ txs, defaultTxFilter, txFilter: defaultTxFilter, hasChanged: false });
  },
  loading: false,
  setLoading: (loading) => {
    set({ loading });
  },
  password: "",
  updatePassword: (password: string) => {
    set({ password });
  },
  dateTab: "month",
  setDateTab: (dateTab) => {
    set({ dateTab });
  },
  dates: { from: new Date(), to: new Date() },
  txFilter: emptyTxFilter,
  defaultTxFilter: emptyTxFilter,
  txSort: { sort: "date-asc" },
  filterTab: "aggregated",
  hasChanged: false,
  setTxFilter: (txFilter) => {
    set(({ defaultTxFilter }) => ({
      hasChanged: isChanged(txFilter, defaultTxFilter),
      txFilter,
    }));
  },
  setTxSort: (txSort) => {
    if (txSort.sort !== "date-asc") {
      set({ hasChanged: true });
    }
    set({ txSort });
  },
  setFilterTab: (filterTab) => set({ filterTab }),
  reset: () => {
    set({ hasChanged: false });
    set(({ defaultTxFilter }) => ({
      txFilter: defaultTxFilter,
      txSort: { sort: "date-asc" },
    }));
  },
  month: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  setMonth: (month) => {
    set({ month });
  },
  range: { from: new Date(), to: new Date() },
  setRange: (range) => {
    set({ range });
  },
}));
