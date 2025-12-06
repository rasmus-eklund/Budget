import { create } from "zustand";
import type { FromTo } from "~/lib/zodSchemas";
import type { FilterTab, Tx, TxSort, DateTab, Filter } from "~/types";
import { filterChanged, resetFilter } from "~/lib";
import { emptyOptions } from "~/constants";

export const useStore = create<{
  txs: Tx[];
  setTxs: (d: {
    txs: Tx[];
    options: Filter;
    reset?: boolean;
    tab?: FilterTab;
  }) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  password: string;
  updatePassword: (password: string) => void;
  dateTab: DateTab;
  setDateTab: (dateTab: DateTab) => void;
  options: Filter;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  txSort: TxSort;
  filterTab: FilterTab;
  hasChanged: boolean;
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
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;
  showDateFilter: boolean;
  setShowDateFilter: (showDateFilter: boolean) => void;
}>((set, get) => ({
  txs: [],
  setTxs: ({ txs, options, reset = false, tab = "aggregated" }) => {
    return set({
      txs,
      hasChanged: filterChanged({
        defaultFilter: options,
        filter: get().filter,
      }),
      options,
      filter: reset ? resetFilter(options) : get().filter,
      filterTab: reset ? tab : get().filterTab,
    });
  },
  loading: true,
  setLoading: (loading) => set({ loading }),
  password: "",
  updatePassword: (password: string) => set({ password }),
  dateTab: "month",
  setDateTab: (dateTab) => set({ dateTab }),
  options: emptyOptions,
  filter: emptyOptions,
  setFilter: (filter) =>
    set({
      filter,
      hasChanged: filterChanged({ defaultFilter: get().options, filter }),
    }),
  txSort: { sort: "date-asc" },
  filterTab: "aggregated",
  hasChanged: false,
  setTxSort: (txSort) => {
    if (txSort.sort !== "date-asc") {
      set({ hasChanged: true });
    } else {
      set({
        hasChanged: filterChanged({
          defaultFilter: get().options,
          filter: get().filter,
        }),
      });
    }
    set({ txSort });
  },
  setFilterTab: (filterTab) => set({ filterTab }),
  reset: () =>
    set(({ options }) => ({
      filter: options,
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
  showFilter: true,
  setShowFilter: (showFilter) => set({ showFilter }),
  showDateFilter: true,
  setShowDateFilter: (showDateFilter) => set({ showDateFilter }),
}));
