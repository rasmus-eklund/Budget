"use client";

import type { FromTo } from "~/lib/zodSchemas";
import { useEffect, useMemo } from "react";
import { applyCategory } from "~/lib/utils/categorize";
import ShowData from "~/components/common/ShowData";
import DateFilter from "~/components/common/DateFilters/DateFilter";
import { categories } from "./_generateData/categories";
import { generateData } from "./_generateData/generateData";
import { useStore } from "~/stores/tx-store";

const DemoPage = () => {
  const data = useMemo(() => generateData(), []);
  const { setTxs, setRange } = useStore();

  const changeDates = async ({ from, to }: FromTo) => {
    const txs = data.txs
      .filter((i) => i.datum >= from && i.datum <= to)
      .map((i) => applyCategory({ tx: i, categories }));
    setTxs(txs);
  };

  useEffect(() => {
    const fromTo = { from: new Date("2023-12-01"), to: new Date("2023-12-31") };
    setRange(fromTo);
  }, [setRange]);

  return (
    <ShowData>
      <DateFilter changeDates={changeDates} />
    </ShowData>
  );
};

export default DemoPage;
