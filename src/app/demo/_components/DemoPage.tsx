"use client";

import type { FromTo } from "~/lib/zodSchemas";
import type { Tx } from "~/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { applyCategory } from "~/lib/utils/categorize";
import ShowData from "~/components/common/ShowData";
import DateFilter from "~/components/common/DateFilters/DateFilter";
import { categories } from "./_generateData/categories";
import { generateData } from "./_generateData/generateData";
import { useTxFilterStore } from "~/stores/tx-filter-store";

const DemoPage = () => {
  const { txs, range } = useMemo(() => generateData(), []);
  const { setTxFilter, setDefaultTxFilter } = useTxFilterStore();
  const fromTo = { from: new Date("2023-12-01"), to: new Date("2023-12-31") };
  const [{ from, to }, setDates] = useState<FromTo>(fromTo);
  const data: Tx[] = useMemo(
    () =>
      txs
        .filter((i) => i.datum >= from && i.datum <= to)
        .map((i) => applyCategory({ tx: i, categories })),
    [txs, from, to],
  );

  const applyDefaultFilters = useCallback(
    (txs: Tx[]) => {
      const category = [...new Set(txs.map((i) => i.budgetgrupp))].filter(
        (i) => i !== "inom",
      );
      const person = [...new Set(txs.map((i) => i.person))];
      const account = [...new Set(txs.map((i) => i.konto))];
      setTxFilter({ account, category, person, search: "" });
      setDefaultTxFilter({ account, category, person, search: "" });
    },
    [setTxFilter, setDefaultTxFilter],
  );

  useEffect(() => {
    applyDefaultFilters(data);
  }, [applyDefaultFilters, data]);

  return (
    <ShowData data={data}>
      <DateFilter
        range={range}
        changeDates={async (dates) => setDates(dates)}
      />
    </ShowData>
  );
};

export default DemoPage;
