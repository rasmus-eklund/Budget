"use client";

import { useEffect, useState } from "react";
import { ShowData } from "~/components/common";
import { useStore } from "~/stores/tx-store";
import type { Filter, Tx } from "~/types";
import type { FromTo } from "~/lib/zodSchemas";

type DateChangeCall = {
  from: string;
  to: string;
};

declare global {
  interface Window {
    __dateChangeCalls?: DateChangeCall[];
  }
}

const serializeDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const serializeRange = ({ from, to }: FromTo): DateChangeCall => ({
  from: serializeDate(from),
  to: serializeDate(to),
});

const allFixtureTxs: Tx[] = [
  {
    id: "1",
    datum: new Date("2024-01-02T00:00:00.000Z"),
    text: "ICA Kvantum Mall Of Scandinavia med extra lang beskrivning for overflowkontroll",
    budgetgrupp: "mat",
    belopp: -1245.67,
    saldo: 24560.12,
    konto: "kortkonto-plus",
    person: "anna-katarina",
  },
  {
    id: "2",
    datum: new Date("2024-01-03T00:00:00.000Z"),
    text: "Autogiro bredband fiberleverantor",
    budgetgrupp: "rakningar",
    belopp: -499.0,
    saldo: 24061.12,
    konto: "spar",
    person: "per",
  },
  {
    id: "3",
    datum: new Date("2024-01-05T00:00:00.000Z"),
    text: "Lon januari",
    budgetgrupp: "inkomst",
    belopp: 36250.0,
    saldo: 60311.12,
    konto: "spar",
    person: "anna-katarina",
  },
  {
    id: "4",
    datum: new Date("2024-01-09T00:00:00.000Z"),
    text: "Resa till kontoret pendeltag och tunnelbana med flera byten och sena kvitton",
    budgetgrupp: "transport",
    belopp: -987.45,
    saldo: 59323.67,
    konto: "kortkonto-plus",
    person: "per",
  },
  {
    id: "5",
    datum: new Date("2024-01-11T00:00:00.000Z"),
    text: "Restaurangbesok med arbetslaget",
    budgetgrupp: "ovrigt",
    belopp: -780.1,
    saldo: 58543.57,
    konto: "kortkonto-plus",
    person: "anna-katarina",
  },
  {
    id: "6",
    datum: new Date("2024-01-16T00:00:00.000Z"),
    text: "Apotek och halsovaror",
    budgetgrupp: "apotek",
    belopp: -333.4,
    saldo: 58210.17,
    konto: "kortkonto-plus",
    person: "per",
  },
  {
    id: "7",
    datum: new Date("2024-02-06T00:00:00.000Z"),
    text: "Februari testtransaktion",
    budgetgrupp: "mat",
    belopp: -456.78,
    saldo: 57753.39,
    konto: "kortkonto-plus",
    person: "per",
  },
  {
    id: "8",
    datum: new Date("2024-03-08T00:00:00.000Z"),
    text: "Mars testtransaktion",
    budgetgrupp: "rakningar",
    belopp: -1200,
    saldo: 56553.39,
    konto: "spar",
    person: "anna-katarina",
  },
];

const fixtureOptions: Filter = {
  category: {
    mat: true,
    rakningar: true,
    inkomst: true,
    transport: true,
    ovrigt: true,
    apotek: true,
    inom: false,
  },
  person: { "anna-katarina": true, per: true },
  account: { "kortkonto-plus": true, spar: true },
  search: "",
};

const visualRange: FromTo = {
  from: new Date("2024-01-01T00:00:00.000Z"),
  to: new Date("2024-01-31T23:59:59.999Z"),
};

const dateFilterRange: FromTo = {
  from: new Date("2024-01-01T00:00:00.000Z"),
  to: new Date("2024-03-31T23:59:59.999Z"),
};

const initialRange: FromTo = {
  from: new Date("2024-01-01T00:00:00.000Z"),
  to: new Date("2024-01-31T23:59:59.999Z"),
};

const filterTxs = ({ from, to }: FromTo) =>
  allFixtureTxs.filter((tx) => tx.datum >= from && tx.datum <= to);

const VisualTransactionsHarness = ({
  canMarkInternal = false,
  dateFilterBehavior = false,
}: {
  canMarkInternal?: boolean;
  dateFilterBehavior?: boolean;
}) => {
  const [ready, setReady] = useState(false);
  const changeDates = async (dates: FromTo) => {
    window.__dateChangeCalls = [
      ...(window.__dateChangeCalls ?? []),
      serializeRange(dates),
    ];

    await new Promise((resolve) => window.setTimeout(resolve, 50));

    const state = useStore.getState();
    state.setSelectedRange(dates);
    state.setDraftRange(dates);
    state.setTxs({
      txs: filterTxs(dates),
      options: fixtureOptions,
    });
  };

  useEffect(() => {
    const range = dateFilterBehavior ? dateFilterRange : visualRange;
    window.__dateChangeCalls = [];
    const state = useStore.getState();
    state.setLoading(false);
    state.setRange(range);
    state.setSelectedRange(initialRange);
    state.setDraftRange(initialRange);
    state.setDateTab("month");
    state.setFilterTab("transactions");
    state.setShowFilter(true);
    state.setShowDateFilter(true);
    state.setTxSort({ sort: "date-asc" });
    state.setTxs({
      txs: filterTxs(initialRange),
      options: fixtureOptions,
      reset: true,
      tab: "transactions",
    });

    const timerId = window.setTimeout(() => {
      setReady(true);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [dateFilterBehavior]);

  if (!ready) {
    return (
      <div className="p-4" data-testid="visual-transactions-loading">
        Loading...
      </div>
    );
  }

  return (
    <section className="flex flex-1 p-2 md:p-4">
      <div
        data-testid="visual-transactions-ready"
        className="mx-auto flex h-180 w-full max-w-4xl flex-col overflow-hidden rounded-lg border bg-card p-3 md:p-4"
      >
        <ShowData changeDates={changeDates} canMarkInternal={canMarkInternal} />
      </div>
    </section>
  );
};

export default VisualTransactionsHarness;
