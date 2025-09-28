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

const getDefaultTxFilter = (txs: Tx[]): TxFilter => ({
  category: [...new Set(txs.map((i) => i.budgetgrupp))].filter(
    (i) => i !== "inom",
  ),
  person: [...new Set(txs.map((i) => i.person))],
  account: [...new Set(txs.map((i) => i.konto))],
  search: "",
});

export const useStore = create<{
  txs: Tx[];
  setTxs: ({ txs, reset }: { txs: Tx[]; reset?: boolean }) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  password: string;
  updatePassword: (password: string) => void;
  dateTab: DateTab;
  setDateTab: (dateTab: DateTab) => void;
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
  day: Date;
  setDay: (day: Date) => void;
  year: number;
  setYear: (year: number) => void;
  dates: FromTo;
  setDates: (dates: FromTo) => void;
  range: FromTo;
  setRange: (range: FromTo) => void;
  sticky: boolean;
  setSticky: (sticky: boolean) => void;
}>((set, get) => ({
  txs: [],
  setTxs: ({ txs, reset = false }) => {
    const defaultTxFilter = getDefaultTxFilter(txs);
    const txFilter = reset ? defaultTxFilter : get().txFilter;
    set({ txs, defaultTxFilter, txFilter, hasChanged: false });
  },
  loading: false,
  setLoading: (loading) => set({ loading }),
  password: "",
  updatePassword: (password: string) => set({ password }),
  dateTab: "month",
  setDateTab: (dateTab) => set({ dateTab }),
  txFilter: emptyTxFilter,
  defaultTxFilter: emptyTxFilter,
  txSort: { sort: "date-asc" },
  filterTab: "aggregated",
  hasChanged: false,
  setTxFilter: (txFilter) =>
    set(({ defaultTxFilter }) => ({
      hasChanged: isChanged(txFilter, defaultTxFilter),
      txFilter,
    })),
  setTxSort: (txSort) => {
    if (txSort.sort !== "date-asc") {
      set({ hasChanged: true });
    }
    set({ txSort });
  },
  setFilterTab: (filterTab) => set({ filterTab }),
  reset: () =>
    set(({ defaultTxFilter }) => ({
      txFilter: defaultTxFilter,
      txSort: { sort: "date-asc" },
      hasChanged: false,
    })),
  month: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  setMonth: (month) => set({ month }),
  day: new Date(),
  setDay: (day) => set({ day }),
  year: new Date().getFullYear(),
  setYear: (year) => set({ year }),
  dates: { from: new Date(), to: new Date() },
  setDates: (dates) => set({ dates }),
  range: { from: new Date(), to: new Date() },
  setRange: (range) =>
    set({
      range,
      month: { month: range.to.getMonth() + 1, year: range.to.getFullYear() },
      day: range.to,
      year: range.to.getFullYear(),
      dates: range,
    }),
  sticky: true,
  setSticky: (sticky) => set({ sticky }),
}));
